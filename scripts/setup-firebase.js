#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Cria interface de linha de comando
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n==== Personal Finance - Configuração do Firebase ====\n');
console.log('Este script irá ajudá-lo a configurar as credenciais do Firebase para o aplicativo.\n');
console.log('Para obter suas credenciais, siga os passos:');
console.log('1. Vá para https://console.firebase.google.com/');
console.log('2. Crie um novo projeto ou selecione um existente');
console.log('3. Adicione um aplicativo web ao seu projeto');
console.log('4. Copie as credenciais fornecidas\n');

// Armazena as credenciais
const credentials = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: ''
};

// Função para perguntar cada credencial
function askCredentials(credentialName, description, next) {
  rl.question(`Digite o ${description} (${credentialName}): `, (answer) => {
    credentials[credentialName] = answer.trim();
    next();
  });
}

// Configurar o arquivo .env.local
function setupEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  const envContent = `REACT_APP_FIREBASE_API_KEY=${credentials.apiKey}
REACT_APP_FIREBASE_AUTH_DOMAIN=${credentials.authDomain}
REACT_APP_FIREBASE_PROJECT_ID=${credentials.projectId}
REACT_APP_FIREBASE_STORAGE_BUCKET=${credentials.storageBucket}
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=${credentials.messagingSenderId}
REACT_APP_FIREBASE_APP_ID=${credentials.appId}`;

  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ Arquivo .env.local criado com sucesso!\n');
}

// Função para configurar as regras do Firestore (opcional)
function setupFirestoreRules() {
  const rulesPath = path.join(__dirname, '..', 'firestore.rules');
  const rulesContent = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /receitas/{docId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    match /despesas/{docId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    match /categorias_receita/{docId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    match /categorias_despesa/{docId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    match /backups/{docId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}`;

  fs.writeFileSync(rulesPath, rulesContent);
  console.log('✅ Arquivo firestore.rules criado com sucesso!\n');
  console.log('Para implantar essas regras, execute: firebase deploy --only firestore:rules\n');
}

// Função principal
function main() {
  askCredentials('apiKey', 'API Key', () => {
    askCredentials('authDomain', 'Auth Domain', () => {
      askCredentials('projectId', 'Project ID', () => {
        askCredentials('storageBucket', 'Storage Bucket', () => {
          askCredentials('messagingSenderId', 'Messaging Sender ID', () => {
            askCredentials('appId', 'App ID', () => {
              setupEnvFile();
              
              rl.question('Deseja criar um arquivo de regras do Firestore? (s/n): ', (answer) => {
                if (answer.toLowerCase() === 's') {
                  setupFirestoreRules();
                }
                
                console.log('Configuração concluída! Execute o comando abaixo para iniciar o aplicativo:\n');
                console.log('  npm start\n');
                rl.close();
              });
            });
          });
        });
      });
    });
  });
}

// Inicia o script
main();
