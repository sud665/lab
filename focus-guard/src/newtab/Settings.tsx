import { useState, useRef } from 'react';
import { Shield, Zap, Plus, Trash2, Globe, Clock, Target, Banknote, ArrowLeft, Download, Upload, Database, Bell } from 'lucide-react';
import { useAppStore } from '../shared/store';
import { useChromeSync } from '../shared/hooks/useChromeSync';
import { formatMoney } from '../shared/utils/time';
import { MONO, SORA } from '../shared/utils/style';
import { exportData, importData } from '../shared/utils/exportImport';
import type { DistractingSite } from '../shared/types';

export function Settings({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { settings, setSettings, loadFromStorage } = useAppStore();
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteAction, setNewSiteAction] = useState<'redirect' | 'effect'>('effect');
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useChromeSync();

  const handleAddSite = () => {
    if (newSiteUrl.trim() && newSiteName.trim()) {
      const site: DistractingSite = { url: newSiteUrl.trim(), name: newSiteName.trim(), action: newSiteAction };
      setSettings({ distractingSites: [...settings.distractingSites, site] });
      setNewSiteUrl('');
      setNewSiteName('');
    }
  };

  const handleRemoveSite = (index: number) => {
    setSettings({ distractingSites: settings.distractingSites.filter((_, i) => i !== index) });
  };

  const handleExport = async () => {
    try {
      await exportData();
    } catch {
      setImportStatus({ type: 'error', message: '내보내기 중 오류가 발생했습니다.' });
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportStatus(null);
    const result = await importData(file);
    if (result.success) {
      await loadFromStorage();
      setImportStatus({ type: 'success', message: '데이터를 성공적으로 가져왔습니다.' });
    } else {
      setImportStatus({ type: 'error', message: result.error ?? '가져오기에 실패했습니다.' });
    }
    // 같은 파일 재선택 허용
    e.target.value = '';
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-surface-deep text-text-primary" style={{ fontFamily: "'Noto Sans KR', 'Sora', sans-serif" }}>
      <div className="w-full max-w-2xl mx-auto px-6 py-6">

        {/* Header */}
        <header className="mb-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            {onNavigate && (
              <button onClick={() => onNavigate('dashboard')} className="btn p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-elevated" aria-label="뒤로">
                <ArrowLeft size={18} />
              </button>
            )}
            <h1 className="text-[24px] font-bold text-gold-gradient" style={SORA}>설정</h1>
          </div>
          <p className="text-[13px] text-text-muted">Focus Guard 동작 방식을 설정합니다</p>
        </header>

        <div className="space-y-4">

          {/* ── 시급 설정 ── */}
          <Section icon={<Banknote size={16} />} title="시급 설정">
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-text-muted">₩</span>
              <input type="number" value={settings.hourlyRate}
                onChange={(e) => setSettings({ hourlyRate: Number(e.target.value) })}
                step={1000} min={0}
                aria-label="시급 (원)"
                className="input-base flex-1 px-4 py-2.5 text-[16px] font-bold" style={MONO} />
              <span className="text-[12px] text-text-muted whitespace-nowrap">원 / 시간</span>
            </div>
            <p className="mt-2.5 text-[12px] text-text-muted">
              하루 {settings.dailyGoal.hours}시간 달성 시 <span className="text-gold-400 font-semibold">{formatMoney(settings.hourlyRate * settings.dailyGoal.hours)}</span>
            </p>
          </Section>

          {/* ── 모드 설정 ── */}
          <Section icon={<Shield size={16} />} title="차단 모드" delay="0.05s">
            <div className="grid grid-cols-2 gap-3">
              <ModeCard active={settings.mode === 'strict'} onClick={() => setSettings({ mode: 'strict' })}
                icon={<Shield size={16} />} title="엄격 모드" desc="방해 사이트 즉시 차단. 목표 달성 전 해제 불가." />
              <ModeCard active={settings.mode === 'auto'} onClick={() => setSettings({ mode: 'auto' })}
                icon={<Zap size={16} />} title="자동 모드" desc="경고만 표시, 접근 허용. 손실 금액 실시간 표시." />
            </div>
          </Section>

          {/* ── 일일 목표 ── */}
          <Section icon={<Target size={16} />} title="일일 목표" delay="0.1s">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-text-muted font-bold tracking-wide uppercase block mb-1.5">집중 시간</label>
                <div className="flex items-center gap-2">
                  <input type="number" value={settings.dailyGoal.hours}
                    onChange={(e) => setSettings({ dailyGoal: { ...settings.dailyGoal, hours: Number(e.target.value) } })}
                    min={1} max={24} aria-label="일일 집중 목표 시간"
                    className="input-base flex-1 px-3 py-2 text-[15px] font-bold text-center" style={MONO} />
                  <span className="text-[12px] text-text-muted">시간</span>
                </div>
              </div>
              <div>
                <label className="text-[11px] text-text-muted font-bold tracking-wide uppercase block mb-1.5">완료 작업 수</label>
                <div className="flex items-center gap-2">
                  <input type="number" value={settings.dailyGoal.tasks}
                    onChange={(e) => setSettings({ dailyGoal: { ...settings.dailyGoal, tasks: Number(e.target.value) } })}
                    min={1} max={20} aria-label="일일 완료 작업 수 목표"
                    className="input-base flex-1 px-3 py-2 text-[15px] font-bold text-center" style={MONO} />
                  <span className="text-[12px] text-text-muted">개</span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-[12px] text-text-muted">목표 달성 시 차단 해제 및 자유시간이 활성화됩니다.</p>
          </Section>

          {/* ── 방해 사이트 ── */}
          <Section icon={<Globe size={16} className="text-loss" />} title="방해 사이트" goldIcon={false} delay="0.15s">
            <div className="space-y-2 mb-4" role="list" aria-label="방해 사이트 목록">
              {settings.distractingSites.map((site, index) => (
                <div key={index} role="listitem" className="flex items-center gap-3 rounded-xl px-4 py-3 bg-surface-base" style={{ border: '1px solid var(--color-surface-border)' }}>
                  <Globe size={14} className="text-text-muted flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-text-primary">{site.name}</p>
                    <p className="text-[11px] text-text-muted" style={MONO}>{site.url}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide"
                    style={{
                      background: site.action === 'redirect' ? 'rgba(251,113,133,0.1)' : 'rgba(232,185,49,0.1)',
                      color: site.action === 'redirect' ? '#fb7185' : '#e8b931',
                      border: `1px solid ${site.action === 'redirect' ? 'rgba(251,113,133,0.2)' : 'rgba(232,185,49,0.2)'}`,
                    }}>
                    {site.action === 'redirect' ? '차단' : '경고'}
                  </span>
                  <button onClick={() => handleRemoveSite(index)}
                    className="p-1.5 rounded-lg cursor-pointer text-loss opacity-30 hover:opacity-100 transition-opacity duration-200 bg-transparent border-none"
                    aria-label={`${site.name} 삭제`}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {settings.distractingSites.length === 0 && (
                <p className="text-[12px] text-text-muted text-center py-5">등록된 방해 사이트가 없습니다</p>
              )}
            </div>

            {/* Add form */}
            <div className="rounded-xl p-4 bg-surface-base" style={{ border: '1px solid var(--color-surface-border)' }}>
              <div className="grid grid-cols-2 gap-2.5 mb-3">
                <input type="text" placeholder="사이트 이름" value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                  aria-label="방해 사이트 이름"
                  className="input-base px-3 py-2 text-[12px]" />
                <input type="text" placeholder="URL (예: twitter.com)" value={newSiteUrl}
                  onChange={(e) => setNewSiteUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSite()}
                  aria-label="방해 사이트 URL"
                  className="input-base px-3 py-2 text-[12px]" style={MONO} />
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex rounded-lg overflow-hidden flex-1" style={{ border: '1px solid var(--color-surface-border)' }}>
                  <button onClick={() => setNewSiteAction('redirect')}
                    className="flex-1 py-2 text-[11px] font-bold transition-all duration-200 cursor-pointer border-none"
                    style={{
                      background: newSiteAction === 'redirect' ? 'rgba(251,113,133,0.1)' : 'transparent',
                      color: newSiteAction === 'redirect' ? '#fb7185' : '#5c5c66',
                      borderRight: '1px solid var(--color-surface-border)',
                    }}>
                    차단
                  </button>
                  <button onClick={() => setNewSiteAction('effect')}
                    className="flex-1 py-2 text-[11px] font-bold transition-all duration-200 cursor-pointer border-none"
                    style={{
                      background: newSiteAction === 'effect' ? 'rgba(232,185,49,0.1)' : 'transparent',
                      color: newSiteAction === 'effect' ? '#e8b931' : '#5c5c66',
                    }}>
                    경고
                  </button>
                </div>
                <button onClick={handleAddSite} className="btn btn-gold px-4 py-2 text-[12px]">
                  <Plus size={14} /> 추가
                </button>
              </div>
            </div>
          </Section>

          {/* ── 주간 목표 ── */}
          <Section icon={<Clock size={16} />} title="주간 목표" delay="0.2s">
            <div className="flex items-center gap-3">
              <input type="number" value={settings.weeklyGoal.hours}
                onChange={(e) => setSettings({ weeklyGoal: { hours: Number(e.target.value) } })}
                min={1} max={168} aria-label="주간 목표 시간"
                className="input-base w-28 px-3 py-2 text-[15px] font-bold text-center" style={MONO} />
              <span className="text-[12px] text-text-muted">시간 / 주</span>
            </div>
          </Section>

          {/* ── 알림 설정 ── */}
          <Section icon={<Bell size={16} />} title="알림 설정" delay="0.25s">
            <div className="space-y-3">
              <NotificationToggle
                label="전체 알림"
                checked={settings.notifications.enabled}
                onChange={(v) => setSettings({ notifications: { ...settings.notifications, enabled: v } })}
              />
              <div className="divider" />
              <NotificationToggle
                label="작업 완료 알림"
                desc="작업의 목표 시간 도달 시 알림"
                checked={settings.notifications.sessionComplete}
                disabled={!settings.notifications.enabled}
                onChange={(v) => setSettings({ notifications: { ...settings.notifications, sessionComplete: v } })}
              />
              <NotificationToggle
                label="방해 사이트 경고"
                desc="방해 사이트 접속 시 알림"
                checked={settings.notifications.distractionAlert}
                disabled={!settings.notifications.enabled}
                onChange={(v) => setSettings({ notifications: { ...settings.notifications, distractionAlert: v } })}
              />
              <NotificationToggle
                label="목표 달성 알림"
                desc="일일 목표 달성 시 축하 알림"
                checked={settings.notifications.goalAchieved}
                disabled={!settings.notifications.enabled}
                onChange={(v) => setSettings({ notifications: { ...settings.notifications, goalAchieved: v } })}
              />
            </div>
          </Section>

          {/* ── 데이터 관리 ── */}
          <Section icon={<Database size={16} />} title="데이터 관리" delay="0.3s">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <button onClick={handleExport}
                  className="btn flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold transition-all duration-200 cursor-pointer"
                  style={{ background: 'var(--color-surface-base)', border: '1px solid var(--color-surface-border)', color: 'var(--color-text-primary)' }}>
                  <Download size={14} /> 내보내기
                </button>
                <button onClick={() => fileInputRef.current?.click()}
                  className="btn flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold transition-all duration-200 cursor-pointer"
                  style={{ background: 'var(--color-surface-base)', border: '1px solid var(--color-surface-border)', color: 'var(--color-text-primary)' }}>
                  <Upload size={14} /> 가져오기
                </button>
                <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
              </div>
              {importStatus && (
                <p className={`text-[12px] font-semibold ${importStatus.type === 'success' ? 'text-earn' : 'text-loss'}`}>
                  {importStatus.message}
                </p>
              )}
              <p className="text-[11px] text-text-muted">설정, 작업, 통계 데이터를 JSON 파일로 백업하거나 복원할 수 있습니다.</p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

/* ── Sub Components ── */

function Section({ icon, title, children, goldIcon = true, delay }: {
  icon: React.ReactNode; title: string; children: React.ReactNode; goldIcon?: boolean; delay?: string;
}) {
  return (
    <section className="card rounded-xl p-5 animate-fade-in" style={delay ? { animationDelay: delay } : undefined}>
      <div className="flex items-center gap-2.5 mb-4">
        <span className={goldIcon ? 'text-gold-400' : ''}>{icon}</span>
        <h2 className="text-[14px] font-bold" style={{ fontFamily: "'Sora', sans-serif" }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function NotificationToggle({ label, desc, checked, disabled, onChange }: {
  label: string; desc?: string; checked: boolean; disabled?: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className={`flex items-center justify-between py-1 ${disabled ? 'opacity-40' : ''}`}>
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-text-primary">{label}</p>
        {desc && <p className="text-[11px] text-text-muted mt-0.5">{desc}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className="relative flex-shrink-0 w-10 h-[22px] rounded-full transition-colors duration-200 cursor-pointer border-none"
        style={{
          background: checked ? 'rgba(232,185,49,0.25)' : 'var(--color-surface-elevated)',
          border: `1px solid ${checked ? 'rgba(232,185,49,0.3)' : 'var(--color-surface-border)'}`,
        }}
      >
        <span
          className="absolute top-[2px] w-4 h-4 rounded-full transition-all duration-200"
          style={{
            left: checked ? '20px' : '2px',
            background: checked ? '#e8b931' : 'var(--color-text-muted)',
          }}
        />
      </button>
    </div>
  );
}

function ModeCard({ active, onClick, icon, title, desc }: {
  active: boolean; onClick: () => void; icon: React.ReactNode; title: string; desc: string;
}) {
  return (
    <button onClick={onClick}
      aria-pressed={active}
      className="rounded-xl p-4 text-left transition-all duration-200 cursor-pointer"
      style={{
        background: active ? 'rgba(232,185,49,0.06)' : 'var(--color-surface-base)',
        border: `1.5px solid ${active ? 'rgba(232,185,49,0.3)' : 'var(--color-surface-border)'}`,
      }}>
      <div className="flex items-center gap-2 mb-2">
        <span style={{ color: active ? '#e8b931' : '#5c5c66' }}>{icon}</span>
        <span className="text-[13px] font-bold" style={{ color: active ? '#e8b931' : '#9898a3' }}>{title}</span>
      </div>
      <p className="text-[11px] text-text-muted leading-relaxed">{desc}</p>
    </button>
  );
}
