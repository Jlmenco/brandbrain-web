"use client";

import { useCallback, useState } from "react";
import { useWorkspace } from "@/contexts/workspace-context";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Eye, FileText } from "lucide-react";

export default function ReportsPage() {
  const { selectedOrg, selectedCostCenter } = useWorkspace();

  const today = new Date().toISOString().split("T")[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];

  const [dateFrom, setDateFrom] = useState(thirtyDaysAgo);
  const [dateTo, setDateTo] = useState(today);
  const [reportType, setReportType] = useState("metrics_overview");
  const [previewHtml, setPreviewHtml] = useState("");
  const [loading, setLoading] = useState(false);

  const params = useCallback(() => {
    const p: Record<string, string> = {
      date_from: dateFrom,
      date_to: dateTo,
      report_type: reportType,
    };
    if (selectedCostCenter) p.cc_id = selectedCostCenter.id;
    if (selectedOrg) p.org_id = selectedOrg.id;
    return p;
  }, [dateFrom, dateTo, reportType, selectedCostCenter, selectedOrg]);

  const handlePreview = async () => {
    setLoading(true);
    try {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "/api"}/reports/preview?${new URLSearchParams(params()).toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("bb_token")}`,
          },
        },
      );
      const html = await resp.text();
      setPreviewHtml(html);
    } catch {
      setPreviewHtml("<p>Erro ao gerar preview</p>");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const url = api.generateReportUrl(params() as { date_from: string; date_to: string; cc_id?: string; org_id?: string; report_type?: string });
    // Open in new tab — the endpoint returns Content-Disposition: attachment
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    // Add auth via fetch + blob
    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("bb_token")}`,
      },
    })
      .then((resp) => resp.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `relatorio_${dateFrom}_${dateTo}.pdf`;
        a.click();
        URL.revokeObjectURL(blobUrl);
      })
      .catch(() => {});
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Relatorios</h1>
        <p className="text-sm text-muted-foreground">
          Gere relatorios de metricas e performance em PDF
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configurar Relatorio</CardTitle>
          <CardDescription>
            Selecione o periodo e tipo de relatorio desejado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Data inicio
              </label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Data fim
              </label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Tipo
              </label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metrics_overview">Visao Geral</SelectItem>
                  <SelectItem value="content_performance">Performance de Conteudo</SelectItem>
                  <SelectItem value="full_monthly">Relatorio Mensal Completo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handlePreview} disabled={loading} variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                {loading ? "Gerando..." : "Preview"}
              </Button>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Baixar PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {previewHtml && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Preview do Relatorio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <iframe
              srcDoc={previewHtml}
              className="w-full min-h-[600px] border rounded-lg bg-white"
              title="Report Preview"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
