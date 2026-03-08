// Utilitario de exportacao CSV e PDF para Brand Brain
// Sem dependencias externas

/**
 * Escapa um valor para uso seguro em CSV.
 * Trata virgulas, aspas duplas, quebras de linha e valores nulos.
 */
function escapeCSVValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  const str = typeof value === "object" ? JSON.stringify(value) : String(value);

  // Se contem virgula, aspas duplas, ou quebra de linha, envolver em aspas
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    // Escapar aspas duplas dobrando-as
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/**
 * Exporta um array de objetos para um arquivo CSV e dispara o download.
 *
 * @param data - Array de objetos a serem exportados
 * @param filename - Nome do arquivo (sem extensao, .csv sera adicionado)
 * @param columns - Colunas a incluir (opcional). Se omitido, usa todas as chaves do primeiro item.
 */
export function exportToCSV(
  data: Record<string, unknown>[],
  filename: string,
  columns?: { key: string; label: string }[]
): void {
  if (!data || data.length === 0) {
    return;
  }

  // Determinar colunas: usar as fornecidas ou derivar do primeiro item
  const cols: { key: string; label: string }[] = columns
    ? columns
    : Object.keys(data[0]).map((key) => ({ key, label: key }));

  // Montar linha de cabecalho
  const headerRow = cols.map((col) => escapeCSVValue(col.label)).join(",");

  // Montar linhas de dados
  const dataRows = data.map((item) =>
    cols.map((col) => escapeCSVValue(item[col.key])).join(",")
  );

  // Juntar tudo com quebras de linha
  const csvContent = [headerRow, ...dataRows].join("\r\n");

  // BOM UTF-8 para suporte a caracteres portugueses (acentos, cedilha, etc.)
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });

  // Criar link temporario e disparar download
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();

  // Limpar recursos
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exporta dados para PDF abrindo uma nova janela com tabela HTML estilizada
 * e disparando o dialogo de impressao do navegador.
 *
 * @param title - Titulo exibido no topo do documento
 * @param data - Array de objetos a serem exportados
 * @param columns - Colunas a incluir com chave e label
 */
export function exportToPDF(
  title: string,
  data: Record<string, unknown>[],
  columns: { key: string; label: string }[]
): void {
  if (!data || data.length === 0) {
    return;
  }

  // Formatar valor para exibicao na tabela
  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "Sim" : "Nao";
    if (value instanceof Date) return value.toLocaleDateString("pt-BR");
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  // Montar linhas da tabela HTML
  const headerCells = columns
    .map((col) => `<th>${col.label}</th>`)
    .join("");

  const bodyRows = data
    .map(
      (item) =>
        `<tr>${columns
          .map((col) => `<td>${formatValue(item[col.key])}</td>`)
          .join("")}</tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1a1a1a;
      padding: 32px;
      background: #fff;
    }

    h1 {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .meta {
      font-size: 12px;
      color: #666;
      margin-bottom: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    th {
      background-color: #f5f5f5;
      font-weight: 600;
      text-align: left;
      padding: 8px 10px;
      border: 1px solid #ddd;
      white-space: nowrap;
    }

    td {
      padding: 6px 10px;
      border: 1px solid #ddd;
      vertical-align: top;
    }

    tr:nth-child(even) {
      background-color: #fafafa;
    }

    .footer {
      margin-top: 20px;
      font-size: 11px;
      color: #999;
      text-align: right;
    }

    @media print {
      body {
        padding: 16px;
      }

      table {
        font-size: 11px;
      }

      th {
        background-color: #f0f0f0 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      tr:nth-child(even) {
        background-color: #f9f9f9 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .footer {
        position: fixed;
        bottom: 16px;
        right: 16px;
      }
    }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p class="meta">Gerado em ${new Date().toLocaleDateString("pt-BR")} as ${new Date().toLocaleTimeString("pt-BR")} &mdash; ${data.length} registro${data.length !== 1 ? "s" : ""}</p>
  <table>
    <thead>
      <tr>${headerCells}</tr>
    </thead>
    <tbody>
      ${bodyRows}
    </tbody>
  </table>
  <p class="footer">Brand Brain &mdash; Relatorio gerado automaticamente</p>
  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>`;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}
