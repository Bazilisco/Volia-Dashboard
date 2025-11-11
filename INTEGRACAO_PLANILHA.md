# Guia de Integração com Planilha

Este documento explica como integrar os dados do Dashboard com uma planilha (Google Sheets, Excel Online, etc).

## 📋 Estrutura da Planilha

### Aba 1: Comentários e Menções
| Coluna | Tipo | Obrigatório | Exemplo | Descrição |
|--------|------|-------------|---------|-----------|
| instagram_handle | Texto | ✅ Sim | @ana_silva | Handle do Instagram (com @) |
| name | Texto | ❌ Não | Ana Silva | Nome completo do usuário |
| type | Texto | ✅ Sim | story | Tipo: story, feed ou reels |
| comment | Texto | ✅ Sim | Adorei o conteúdo! | Texto do comentário |
| sentiment | Texto | ✅ Sim | positive | Sentimento: positive, neutral ou negative |
| time | Texto | ✅ Sim | 2 min | Tempo relativo (ex: "agora", "2 min", "1h") |

### Aba 2: Top Engajadores
| Coluna | Tipo | Obrigatório | Exemplo | Descrição |
|--------|------|-------------|---------|-----------|
| instagram_handle | Texto | ✅ Sim | @ana_silva | Handle do Instagram (com @) |
| name | Texto | ❌ Não | Ana Silva | Nome completo do usuário |
| interactions | Número | ✅ Sim | 147 | Total de interações |
| trend | Texto | ✅ Sim | +12% | Tendência (ex: +12%, -2%) |

## 🔌 Opções de Integração

### Opção 1: Google Sheets + Lovable Cloud

1. **Criar Edge Function no Lovable Cloud:**
```typescript
// Arquivo: supabase/functions/get-sheet-data/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const SHEET_ID = 'SEU_SHEET_ID';
const API_KEY = Deno.env.get('GOOGLE_SHEETS_API_KEY');

serve(async (req) => {
  try {
    // Buscar dados da planilha
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Comentarios!A2:G?key=${API_KEY}`
    );
    
    const data = await response.json();
    
    // Transformar dados para o formato esperado
    const comments = data.values.map((row: string[], index: number) => ({
      id: index + 1,
      instagram_handle: row[0],
      name: row[1] || null,
      type: row[2],
      comment: row[3],
      sentiment: row[4],
      time: row[5],
    }));
    
    return new Response(JSON.stringify(comments), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
```

2. **Atualizar o Dashboard para usar a Edge Function:**
```typescript
// No Dashboard.tsx
useEffect(() => {
  const loadData = async () => {
    const response = await fetch('/api/get-sheet-data');
    const data = await response.json();
    setRecentComments(data);
  };
  loadData();
}, []);
```

### Opção 2: Google Sheets + Apps Script

1. **Criar Apps Script na planilha:**
```javascript
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Comentarios');
  const data = sheet.getDataRange().getValues();
  
  // Remover cabeçalho
  const rows = data.slice(1);
  
  const comments = rows.map((row, index) => ({
    id: index + 1,
    instagram_handle: row[0],
    name: row[1],
    type: row[2],
    comment: row[3],
    sentiment: row[4],
    time: row[5]
  }));
  
  return ContentService.createTextOutput(JSON.stringify(comments))
    .setMimeType(ContentService.MimeType.JSON);
}
```

2. **Publicar como Web App e usar a URL no Dashboard**

### Opção 3: CSV/Excel via Upload

1. Adicionar botão de upload no Dashboard
2. Usar biblioteca como `papaparse` para ler CSV
3. Validar e carregar dados

## 🔐 Segurança

- ✅ Sempre valide os dados antes de exibir
- ✅ Use validação de schema (zod) para garantir formato correto
- ✅ Sanitize os comentários para evitar XSS
- ✅ Armazene API keys em variáveis de ambiente (Lovable Cloud Secrets)

## 📝 Validação de Dados

O arquivo `src/services/dataService.ts` contém funções auxiliares:

- `validateInstagramHandle()`: Valida formato do handle
- `normalizeInstagramHandle()`: Adiciona @ se necessário
- `generateAvatar()`: Gera iniciais automaticamente

## 🚀 Próximos Passos

1. Escolha o método de integração
2. Configure as credenciais necessárias
3. Teste com dados mockados primeiro
4. Implemente a integração real
5. Adicione tratamento de erros e loading states

## 📞 Suporte

Para mais informações sobre Lovable Cloud:
- [Documentação Cloud](https://docs.lovable.dev/features/cloud)
- [Edge Functions](https://docs.lovable.dev/features/cloud/edge-functions)
