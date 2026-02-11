import { useState, useRef } from "react";
import { useAppStore } from "../../shared/store";
import { useChromeSync } from "../../shared/hooks/useChromeSync";
import { exportData, importData } from "../../shared/utils/exportImport";
import type { DistractingSite } from "../../shared/types";

export function useSettings() {
  const { settings, setSettings, loadFromStorage } = useAppStore();
  const [newSiteUrl, setNewSiteUrl] = useState("");
  const [newSiteName, setNewSiteName] = useState("");
  const [newSiteAction, setNewSiteAction] = useState<"redirect" | "effect">(
    "effect",
  );
  const [importStatus, setImportStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useChromeSync();

  const handleAddSite = () => {
    if (newSiteUrl.trim() && newSiteName.trim()) {
      const site: DistractingSite = {
        url: newSiteUrl.trim(),
        name: newSiteName.trim(),
        action: newSiteAction,
      };
      setSettings({
        distractingSites: [...settings.distractingSites, site],
      });
      setNewSiteUrl("");
      setNewSiteName("");
    }
  };

  const handleRemoveSite = (index: number) => {
    setSettings({
      distractingSites: settings.distractingSites.filter(
        (_, i) => i !== index,
      ),
    });
  };

  const handleExport = async () => {
    try {
      await exportData();
    } catch {
      setImportStatus({
        type: "error",
        message: "내보내기 중 오류가 발생했습니다.",
      });
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportStatus(null);
    const result = await importData(file);
    if (result.success) {
      await loadFromStorage();
      setImportStatus({
        type: "success",
        message: "데이터를 성공적으로 가져왔습니다.",
      });
    } else {
      setImportStatus({
        type: "error",
        message: result.error ?? "가져오기에 실패했습니다.",
      });
    }
    e.target.value = "";
  };

  return {
    settings,
    setSettings,
    newSiteUrl,
    setNewSiteUrl,
    newSiteName,
    setNewSiteName,
    newSiteAction,
    setNewSiteAction,
    importStatus,
    fileInputRef,
    handleAddSite,
    handleRemoveSite,
    handleExport,
    handleImport,
  };
}
