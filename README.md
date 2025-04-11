# PersonalFinance - Aplicativo de Gestão Financeira Pessoal

PersonalFinance é uma aplicação web para gestão financeira pessoal, desenvolvida com React, Firebase e outras tecnologias modernas.

## Funcionalidades

- **Autenticação de Usuários**: Login seguro com email/senha
- **Gestão de Receitas**: Cadastre e gerencie suas fontes de renda
- **Gestão de Despesas**: Controle todos os seus gastos
- **Categorização**: Organize receitas e despesas em categorias personalizadas
- **Orçamentos**: Defina limites de gastos por categoria
- **Dashboard**: Visualize sua situação financeira em tempo real
- **Relatórios**: Analise seus gastos e receitas por período
- **Exportação**: Exporte seus dados em PDF
- **Backup**: Sistema de backup automático e manual
- **Tema Escuro/Claro**: Interface adaptável à sua preferência

## Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication)
- **Gráficos**: Recharts
- **Exportação**: html2canvas, jsPDF
- **Gerência de Estado**: Context API
- **Roteamento**: React Router
- **Ícones**: Heroicons
- **Data/Hora**: Day.js

## Pré-requisitos

- Node.js (v14+)
- npm ou yarn
- Conta no Firebase

## Configuração

1. Clone o repositório
2. Instale as dependências com `npm install` ou `yarn`
3. Configure seu projeto Firebase e adicione as credenciais no arquivo `.env.local`
4. Execute `npm start` ou `yarn start` para iniciar a aplicação em modo de desenvolvimento

## Estrutura do Projeto

```
src/
├── assets/        # Recursos estáticos (imagens, etc.)
├── components/    # Componentes React reutilizáveis
├── context/       # Contextos do React (Auth, Theme, etc.)
├── hooks/         # Hooks personalizados
├── pages/         # Páginas da aplicação
├── services/      # Serviços (Firebase, API, etc.)
├── types/         # Definições de tipos TypeScript
├── utils/         # Funções utilitárias
├── App.tsx        # Componente principal
└── index.tsx      # Ponto de entrada
```

## Configuração do Firebase

Para usar esta aplicação, você precisará configurar um projeto no Firebase e habilitar:

1. **Authentication**: Para login de usuários
2. **Firestore Database**: Para armazenar os dados

Copie as configurações do seu projeto Firebase para o arquivo `.env.local`.

## Licença

Este projeto está licenciado sob a licença MIT.
