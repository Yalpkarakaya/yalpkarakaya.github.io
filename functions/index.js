const functions = require("firebase-functions");
const fetch = require("node-fetch");
const cors = require("cors")({origin: true});
const admin = require("firebase-admin");

// Initialize Firebase Admin
admin.initializeApp();

// 1. API Anahtar dizisi artık burada, güvenli sunucu tarafında.
const apiKeys = [
    'AIzaSyAGQ_o5-p4m1OEaWYRHwjQZ30oOpKRrAw8',
    'AIzaSyBmX9hT1HQ4iD8u8fueHoyLFEuBkI5gY-c',
    'AIzaSyDjZ2MhrMV5wsXo-Fh-Fr7V3sO-R2AAwAM',
    'AIzaSyDMI1kFaZOD15NdavWCBm2O_oBFNCWAS5c',
    'AIzaSyDc_aS2n97yAOXRFxBZ-W5oLM9QR5d3yco',
    'AIzaSyDzaNQeSYcRMjfiNbxFkp3ST7lTqTBLXH8',
];

// 2. Anahtar döndürme mantığı da burada. Rastgele seçim yapacağız.
function getNextApiKey() {
  if (apiKeys.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * apiKeys.length);
  return apiKeys[randomIndex];
}

exports.geminiProxy = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    if (request.method !== "POST") {
      return response.status(405).send("Method Not Allowed");
    }
    
    const selectedApiKey = getNextApiKey();
    if (!selectedApiKey) {
        return response.status(500).send("API Keys are not configured in the function.");
    }
    
    const targetUrl = request.body.targetUrl;
    if (!targetUrl || !targetUrl.startsWith("https://generativelanguage.googleapis.com")) {
        return response.status(400).send("Invalid target URL provided.");
    }

    try {
        const geminiResponse = await fetch(`${targetUrl}?key=${selectedApiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: request.body.contents,
                systemInstruction: request.body.systemInstruction
            }),
        });

        if (!geminiResponse.ok) {
            const errorBody = await geminiResponse.json();
            return response.status(geminiResponse.status).send(errorBody);
        }

        const responseData = await geminiResponse.json();
        return response.status(200).send(responseData);

    } catch (error) {
        console.error("Proxy Error:", error);
        return response.status(500).send("An error occurred in the proxy function.");
    }
  });
});

// =================================================================
// ===                    REAL-TIME DATA SYNC                     ===
// =================================================================

// Sync project data
exports.syncProjectData = functions.https.onCall(async (data, context) => {
    try {
        // Verify authentication
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
        }

        const { projectId, data: projectData, timestamp } = data;
        
        if (!projectId || !projectData) {
            throw new functions.https.HttpsError('invalid-argument', 'Project ID and data are required');
        }

        // Save to Firestore
        const db = admin.firestore();
        const projectRef = db.collection('projects').doc(projectId);
        
        await projectRef.set({
            ...projectData,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            updatedBy: context.auth.uid,
            version: admin.firestore.FieldValue.increment(1)
        }, { merge: true });

        // Trigger real-time updates
        await projectRef.collection('updates').add({
            type: 'data_sync',
            data: projectData,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            userId: context.auth.uid
        });

        return { success: true, message: 'Data synced successfully' };
    } catch (error) {
        console.error('Sync error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to sync data');
    }
});

// Get project data
exports.getProjectData = functions.https.onCall(async (data, context) => {
    try {
        const { projectId } = data;
        
        if (!projectId) {
            throw new functions.https.HttpsError('invalid-argument', 'Project ID is required');
        }

        const db = admin.firestore();
        const projectDoc = await db.collection('projects').doc(projectId).get();
        
        if (!projectDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Project not found');
        }

        return { 
            success: true, 
            data: projectDoc.data(),
            id: projectDoc.id 
        };
    } catch (error) {
        console.error('Get data error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to get data');
    }
});

// Update project phase status
exports.updatePhaseStatus = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
        }

        const { projectId, phaseId, status, notes } = data;
        
        if (!projectId || !phaseId || !status) {
            throw new functions.https.HttpsError('invalid-argument', 'Project ID, phase ID, and status are required');
        }

        const db = admin.firestore();
        const projectRef = db.collection('projects').doc(projectId);
        
        // Update phase status
        await projectRef.update({
            [`phases.${phaseId}.status`]: status,
            [`phases.${phaseId}.lastUpdated`]: admin.firestore.FieldValue.serverTimestamp(),
            [`phases.${phaseId}.updatedBy`]: context.auth.uid
        });

        // Add status change to updates
        await projectRef.collection('updates').add({
            type: 'phase_status_change',
            phaseId: phaseId,
            status: status,
            notes: notes || '',
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            userId: context.auth.uid
        });

        return { success: true, message: 'Phase status updated successfully' };
    } catch (error) {
        console.error('Update phase error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to update phase status');
    }
});

// Add component to project
exports.addComponent = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
        }

        const { projectId, component } = data;
        
        if (!projectId || !component) {
            throw new functions.https.HttpsError('invalid-argument', 'Project ID and component data are required');
        }

        const db = admin.firestore();
        const projectRef = db.collection('projects').doc(projectId);
        
        // Add component with AI analysis
        const componentWithAI = await analyzeComponent(component);
        
        await projectRef.collection('components').add({
            ...componentWithAI,
            addedAt: admin.firestore.FieldValue.serverTimestamp(),
            addedBy: context.auth.uid
        });

        // Update component count
        await projectRef.update({
            componentCount: admin.firestore.FieldValue.increment(1),
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        });

        return { success: true, message: 'Component added successfully' };
    } catch (error) {
        console.error('Add component error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to add component');
    }
});

// AI Component Analysis
async function analyzeComponent(component) {
    // This would integrate with an AI service like OpenAI or Google AI
    // For now, return the component with basic analysis
    return {
        ...component,
        aiAnalysis: {
            category: categorizeComponent(component.name),
            estimatedCost: estimateCost(component.name),
            criticality: assessCriticality(component.name),
            alternatives: suggestAlternatives(component.name),
            notes: generateNotes(component.name)
        }
    };
}

function categorizeComponent(name) {
    const categories = {
        'mcu': ['esp32', 'arduino', 'microcontroller', 'mcu'],
        'sensor': ['imu', 'accelerometer', 'gyroscope', 'magnetometer', 'sensor'],
        'rf': ['rf', 'radio', 'transmitter', 'receiver', 'antenna'],
        'power': ['battery', 'regulator', 'power', 'voltage', 'current'],
        'passive': ['resistor', 'capacitor', 'inductor', 'diode', 'transistor']
    };
    
    const lowerName = name.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => lowerName.includes(keyword))) {
            return category;
        }
    }
    return 'other';
}

function estimateCost(name) {
    // Simple cost estimation based on component type
    const costRanges = {
        'mcu': { min: 5, max: 25 },
        'sensor': { min: 10, max: 50 },
        'rf': { min: 15, max: 100 },
        'power': { min: 2, max: 20 },
        'passive': { min: 0.1, max: 5 },
        'other': { min: 1, max: 10 }
    };
    
    const category = categorizeComponent(name);
    const range = costRanges[category] || costRanges.other;
    return Math.round((Math.random() * (range.max - range.min) + range.min) * 100) / 100;
}

function assessCriticality(name) {
    const criticalComponents = ['mcu', 'esp32', 'power', 'battery', 'regulator'];
    const lowerName = name.toLowerCase();
    return criticalComponents.some(comp => lowerName.includes(comp)) ? 'high' : 'medium';
}

function suggestAlternatives(name) {
    // Simple alternative suggestions
    const alternatives = {
        'esp32': ['Arduino Nano 33 IoT', 'STM32', 'Raspberry Pi Pico'],
        'imu': ['MPU6050', 'LSM6DS3', 'BMI160'],
        'rf': ['nRF24L01', 'LoRa', 'WiFi', 'Bluetooth']
    };
    
    const lowerName = name.toLowerCase();
    for (const [component, alts] of Object.entries(alternatives)) {
        if (lowerName.includes(component)) {
            return alts;
        }
    }
    return [];
}

function generateNotes(name) {
    const notes = {
        'esp32': 'Güçlü WiFi ve Bluetooth desteği, çoklu sensör bağlantısı için ideal',
        'imu': 'Hassas hareket algılama için kalibre edilmeli',
        'rf': 'Anten tasarımı performansı etkiler, PCB layout önemli',
        'power': 'Güç tüketimi ve verimlilik dikkate alınmalı'
    };
    
    const lowerName = name.toLowerCase();
    for (const [component, note] of Object.entries(notes)) {
        if (lowerName.includes(component)) {
            return note;
        }
    }
    return 'Genel kullanım için uygun';
}

// =================================================================
// ===                    PUSH NOTIFICATIONS                      ===
// =================================================================

// Send push notification
exports.sendNotification = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
        }

        const { userId, title, body, data: notificationData } = data;
        
        if (!userId || !title || !body) {
            throw new functions.https.HttpsError('invalid-argument', 'User ID, title, and body are required');
        }

        // Get user's FCM token
        const db = admin.firestore();
        const userDoc = await db.collection('users').doc(userId).get();
        
        if (!userDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'User not found');
        }

        const userData = userDoc.data();
        const fcmToken = userData.fcmToken;
        
        if (!fcmToken) {
            throw new functions.https.HttpsError('failed-precondition', 'User has no FCM token');
        }

        // Send notification
        const message = {
            token: fcmToken,
            notification: {
                title: title,
                body: body
            },
            data: notificationData || {},
            android: {
                notification: {
                    icon: 'ic_notification',
                    color: '#0ea5e9'
                }
            }
        };

        const response = await admin.messaging().send(message);
        console.log('Successfully sent message:', response);

        return { success: true, messageId: response };
    } catch (error) {
        console.error('Send notification error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send notification');
    }
});

// =================================================================
// ===                    DATA EXPORT/IMPORT                      ===
// =================================================================

// Export project data
exports.exportProject = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
        }

        const { projectId, format = 'json' } = data;
        
        if (!projectId) {
            throw new functions.https.HttpsError('invalid-argument', 'Project ID is required');
        }

        const db = admin.firestore();
        const projectDoc = await db.collection('projects').doc(projectId).get();
        
        if (!projectDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Project not found');
        }

        const projectData = projectDoc.data();
        
        // Get all related data
        const projectRef = db.collection('projects').doc(projectId);
        const componentsSnapshot = await projectRef.collection('components').get();
        const components = componentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const updatesSnapshot = await projectRef.collection('updates').get();
        const updates = updatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const exportData = {
            project: projectData,
            components: components,
            updates: updates,
            exportedAt: new Date().toISOString(),
            exportedBy: context.auth.uid
        };

        return { 
            success: true, 
            data: exportData,
            format: format
        };
    } catch (error) {
        console.error('Export error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to export project');
    }
});

// Import project data
exports.importProject = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
        }

        const { projectData, overwrite = false } = data;
        
        if (!projectData) {
            throw new functions.https.HttpsError('invalid-argument', 'Project data is required');
        }

        const db = admin.firestore();
        const projectId = projectData.project.id || db.collection('projects').doc().id;
        const projectRef = db.collection('projects').doc(projectId);
        
        // Check if project exists
        const existingProject = await projectRef.get();
        if (existingProject.exists && !overwrite) {
            throw new functions.https.HttpsError('already-exists', 'Project already exists. Use overwrite=true to replace.');
        }

        // Import project data
        await projectRef.set({
            ...projectData.project,
            importedAt: admin.firestore.FieldValue.serverTimestamp(),
            importedBy: context.auth.uid
        });

        // Import components
        if (projectData.components) {
            const batch = db.batch();
            projectData.components.forEach(component => {
                const componentRef = projectRef.collection('components').doc();
                batch.set(componentRef, component);
            });
            await batch.commit();
        }

        // Import updates
        if (projectData.updates) {
            const batch = db.batch();
            projectData.updates.forEach(update => {
                const updateRef = projectRef.collection('updates').doc();
                batch.set(updateRef, update);
            });
            await batch.commit();
        }

        return { 
            success: true, 
            projectId: projectId,
            message: 'Project imported successfully' 
        };
    } catch (error) {
        console.error('Import error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to import project');
    }
});

// =================================================================
// ===                    SECURITY & VALIDATION                   ===
// =================================================================

// Validate user input
exports.validateInput = functions.https.onCall(async (data, context) => {
    try {
        const { input, type, rules } = data;
        
        if (!input || !type) {
            throw new functions.https.HttpsError('invalid-argument', 'Input and type are required');
        }

        let isValid = true;
        let errors = [];

        // Basic validation
        switch (type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(input);
                if (!isValid) errors.push('Geçerli bir email adresi giriniz');
                break;
                
            case 'password':
                if (input.length < 8) {
                    isValid = false;
                    errors.push('Şifre en az 8 karakter olmalıdır');
                }
                if (!/[A-Z]/.test(input)) {
                    isValid = false;
                    errors.push('Şifre en az bir büyük harf içermelidir');
                }
                if (!/[0-9]/.test(input)) {
                    isValid = false;
                    errors.push('Şifre en az bir rakam içermelidir');
                }
                break;
                
            case 'text':
                if (input.trim().length === 0) {
                    isValid = false;
                    errors.push('Metin alanı boş olamaz');
                }
                break;
                
            case 'number':
                if (isNaN(input) || input === '') {
                    isValid = false;
                    errors.push('Geçerli bir sayı giriniz');
                }
                break;
        }

        // Custom rules validation
        if (rules) {
            if (rules.minLength && input.length < rules.minLength) {
                isValid = false;
                errors.push(`En az ${rules.minLength} karakter olmalıdır`);
            }
            if (rules.maxLength && input.length > rules.maxLength) {
                isValid = false;
                errors.push(`En fazla ${rules.maxLength} karakter olabilir`);
            }
            if (rules.pattern && !new RegExp(rules.pattern).test(input)) {
                isValid = false;
                errors.push('Geçersiz format');
            }
        }

        return {
            success: true,
            isValid: isValid,
            errors: errors
        };
    } catch (error) {
        console.error('Validation error:', error);
        throw new functions.https.HttpsError('internal', 'Validation failed');
    }
});