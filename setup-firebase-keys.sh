#!/bin/bash

# 🔐 Firebase API Keys Setup Script
# Bu script API anahtarlarınızı güvenli bir şekilde Firebase'e yükler

echo "🔐 Firebase API Keys Setup"
echo "=========================="
echo ""

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Firebase CLI kontrolü
if ! command -v firebase &> /dev/null
then
    echo -e "${RED}❌ Firebase CLI bulunamadı!${NC}"
    echo "Lütfen şu komutla yükleyin: npm install -g firebase-tools"
    exit 1
fi

echo -e "${GREEN}✅ Firebase CLI bulundu${NC}"
echo ""

# API anahtarlarını al
echo -e "${YELLOW}📝 API anahtarlarınızı girin (virgülle ayırın):${NC}"
echo "Örnek: AIzaSyXXX,AIzaSyYYY,AIzaSyZZZ"
read -p "API Keys: " api_keys_input

# Boş kontrol
if [ -z "$api_keys_input" ]; then
    echo -e "${RED}❌ API anahtarı girilmedi!${NC}"
    exit 1
fi

# JSON array'e dönüştür
IFS=',' read -ra KEYS <<< "$api_keys_input"
json_array="["
first=true
for key in "${KEYS[@]}"; do
    # Trim whitespace
    key=$(echo "$key" | xargs)
    if [ "$first" = true ]; then
        json_array+="\"$key\""
        first=false
    else
        json_array+=",\"$key\""
    fi
done
json_array+="]"

echo ""
echo -e "${YELLOW}📤 Firebase'e yükleniyor...${NC}"

# Firebase'e yükle
if firebase functions:config:set gemini.api_keys="$json_array"; then
    echo ""
    echo -e "${GREEN}✅ API anahtarları başarıyla yüklendi!${NC}"
    echo ""
    echo "📋 Yüklenen anahtarlar:"
    firebase functions:config:get gemini.api_keys
    echo ""
    echo -e "${YELLOW}⚠️  Değişikliklerin aktif olması için deploy etmeniz gerekiyor:${NC}"
    echo "   firebase deploy --only functions"
else
    echo ""
    echo -e "${RED}❌ Yükleme başarısız oldu!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Kurulum tamamlandı!${NC}"
