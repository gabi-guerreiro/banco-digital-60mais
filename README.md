# Banco Digital 60+ · App Funcional

Protótipo funcional e interativo de um **app bancário adaptado ao público 60+**, desenvolvido a
partir do artefato de **Design Thinking** (Módulo 2 · Semana 10) de **Marília Pinheiro**.

> 🔗 **Demo ao vivo:** https://gabi-guerreiro.github.io/banco-digital-60mais/

## ✨ Funcionalidades

O app implementa as 5 funcionalidades centrais do projeto, percorrendo a jornada da persona **Maria Lúcia**:

| # | Funcionalidade | Descrição |
|---|----------------|-----------|
| **F01** | Modo Clareza | Saldo em destaque (28px), menu simplificado, 1 intenção por tela |
| **F02** | Assistente Clara | Chat com NLP coloquial + entrada por voz (Web Speech API) |
| **F03** | Confirmação 3 Camadas | Linguagem natural → biometria/PIN → comprovante persistente |
| **F04** | Resumo Narrativo | Dados financeiros viram história, com gráficos |
| **F05** | Linha Direta 60+ | Especialista humano a um toque, com contexto compartilhado |

## 🎨 Princípios de design aplicados

- **Norman** — visibilidade, feedback em 3 camadas, affordance (alvos de toque 48dp+)
- **Gestalt** — proximidade, figura/fundo (contraste 7:1), Prägnanz
- **Nielsen** — heurísticas H1 (status), H2 (linguagem real), H5 (prevenção de erros), H10 (ajuda visível)

## 🛠️ Stack

- [Next.js 16](https://nextjs.org/) (App Router, static export)
- React 19 + TypeScript
- CSS-in-JS inline + tokens de design
- Sem dependências de UI externas

## 🚀 Rodando localmente

```bash
npm install
npm run dev
# abre em http://localhost:3000
```

## 📦 Build estático

```bash
npm run build   # gera a pasta out/ (deploy no GitHub Pages via Actions)
```

---

Desenvolvido como demonstração de Engenharia de UX/UI a partir de pesquisa de Design Thinking.
