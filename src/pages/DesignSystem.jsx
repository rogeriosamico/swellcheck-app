import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BeachCard from "@/components/BeachCard";
import { Search, Heart, Palette, Component as ComponentIcon, Droplets } from "lucide-react";
import SwellPowerBar from "@/components/SwellPowerBar";
import Header from "@/components/Header";
import DateFilterModal from "@/components/DateFilterModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import InfoBlock from "@/components/InfoBlock";
import TideChart from "@/components/TideChart";
import TimeSlider from "@/components/TimeSlider";

/** Reads a live CSS variable value from :root */
function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const DesignSystem = () => {
  const [activeTab, setActiveTab] = useState('fundamentos');
  const [activeSubTab, setActiveSubTab] = useState('cores');

  const menuItems = [
    {
      id: 'fundamentos',
      label: 'Fundamentos',
      icon: Palette,
      subItems: [
        { id: 'cores', label: 'Cores' },
        { id: 'tipografia', label: 'Tipografia' },
        { id: 'espacamento', label: 'Espaçamento' },
        { id: 'radius', label: 'Radius' },
      ]
    },
    {
      id: 'componentes',
      label: 'Componentes',
      icon: ComponentIcon,
      subItems: [
        { id: 'badges', label: 'Badges' },
        { id: 'botoes', label: 'Botões' },
        { id: 'inputs', label: 'Inputs' },
        { id: 'cards', label: 'Cards' },
        { id: 'slider', label: 'Slider' },
        { id: 'infoblock', label: 'Info Block' },
        { id: 'header', label: 'Header' },
        { id: 'modal', label: 'Modal' },
        { id: 'calendar', label: 'Calendário' },
        { id: 'swellpower', label: 'Swell Power Bar' },
        { id: 'tidechart', label: 'Tide Chart' },
      ]
    }
  ];

  const renderContent = () => {
    if (activeTab === 'fundamentos') {
      if (activeSubTab === 'cores') return <ColorsSection />;
      if (activeSubTab === 'tipografia') return <TypographySection />;
      if (activeSubTab === 'espacamento') return <SpacingSection />;
      if (activeSubTab === 'radius') return <RadiusSection />;
    }
    if (activeTab === 'componentes') {
      if (activeSubTab === 'badges') return <BadgesSection />;
      if (activeSubTab === 'botoes') return <ButtonsSection />;
      if (activeSubTab === 'inputs') return <InputsSection />;
      if (activeSubTab === 'cards') return <CardsSection />;
      if (activeSubTab === 'slider') return <SliderSection />;
      if (activeSubTab === 'infoblock') return <InfoBlockSection />;
      if (activeSubTab === 'header') return <HeaderSection />;
      if (activeSubTab === 'modal') return <ModalSection />;
      if (activeSubTab === 'calendar') return <CalendarSection />;
      if (activeSubTab === 'swellpower') return <SwellPowerSection />;
      if (activeSubTab === 'tidechart') return <TideChartSection />;
    }
    return <ColorsSection />;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-family)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: 'var(--surface-secondary)',
        color: 'var(--text-invert)',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
      }}>
        <div style={{ padding: 'var(--spacing-lg) var(--spacing-md)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
            <Droplets size={20} style={{ color: '#60a5fa' }} />
            <span style={{ fontSize: 'var(--font-size-headline)', fontWeight: 'var(--font-weight-bold)' }}>Swell Check</span>
          </div>
          <span style={{ fontSize: 'var(--font-size-subtitle)', opacity: 0.4 }}>Design System</span>
        </div>

        <nav style={{ padding: 'var(--spacing-md) var(--spacing-sm)' }}>
          {menuItems.map((item) => (
            <div key={item.id} style={{ marginBottom: 'var(--spacing-lg)' }}>
              <button
                onClick={() => { setActiveTab(item.id); setActiveSubTab(item.subItems[0].id); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)',
                  width: '100%', padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-minimal)',
                  border: 'none', cursor: 'pointer',
                  fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-family)',
                  background: activeTab === item.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: activeTab === item.id ? '#fff' : 'rgba(255,255,255,0.5)',
                }}
              >
                <item.icon size={16} />
                {item.label}
              </button>
              <div style={{ marginLeft: 36, marginTop: 'var(--spacing-xs)' }}>
                {item.subItems.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => { setActiveTab(item.id); setActiveSubTab(sub.id); }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '6px var(--spacing-sm)', borderRadius: 'var(--radius-minimal)',
                      border: 'none', cursor: 'pointer',
                      fontSize: 'var(--font-size-body)', fontFamily: 'var(--font-family)',
                      background: 'transparent',
                      color: activeTab === item.id && activeSubTab === sub.id
                        ? '#60a5fa'
                        : 'rgba(255,255,255,0.35)',
                      fontWeight: activeTab === item.id && activeSubTab === sub.id ? 'var(--font-weight-bold)' : 'var(--font-weight-regular)',
                    }}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main style={{
        flex: 1,
        marginLeft: 240,
        padding: 'var(--spacing-xl)',
        background: 'var(--surface-primary)',
        minHeight: '100vh',
      }}>
        <h2 style={{ fontSize: 'var(--font-size-title-sm)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-lg)' }}>
          {menuItems.flatMap(m => m.subItems).find(s => s.id === activeSubTab)?.label || activeSubTab}
        </h2>
        {renderContent()}
      </main>
    </div>
  );
};

/* =========================================
   FUNDAMENTOS
   ========================================= */

const colorTokens = {
  text: [
    { name: 'text-primary', figma: 'text/text-primary' },
    { name: 'text-secondary', figma: 'text/text-secondary' },
    { name: 'text-brand', figma: 'text/text-brand' },
    { name: 'text-invert', figma: 'text/text-invert' },
  ],
  conditions: [
    { name: 'text-storm', figma: 'text/text-storm' },
    { name: 'text-bom', figma: 'text/text-bom' },
    { name: 'text-marola', figma: 'text/text-marola' },
    { name: 'text-flat', figma: 'text/text-flat' },
  ],
  surface: [
    { name: 'surface-primary', figma: 'surface/surface-primary' },
    { name: 'surface-secondary', figma: 'surface/surface-secondary' },
    { name: 'surface-terciary', figma: 'surface/surface-terciary' },
  ],
  surfaceConditions: [
    { name: 'surface-storm-solid', figma: 'surface/surface-storm-solid' },
    { name: 'surface-bom-solid', figma: 'surface/surface-bom-solid' },
    { name: 'surface-marola-solid', figma: 'surface/surface-marola-solid' },
    { name: 'surface-flat-solid', figma: 'surface/surface-flat-solid' },
    { name: 'surface-storm-gradient', figma: 'surface/surface-storm-gradient' },
    { name: 'surface-bom-gradient', figma: 'surface/surface-bom-gradient' },
    { name: 'surface-marola-gradient', figma: 'surface/surface-marola-gradient' },
    { name: 'surface-flat-gradient', figma: 'surface/surface-flat-gradient' },
  ],
  border: [
    { name: 'border-primary', figma: 'border/border-primary' },
  ],
};

const ColorsSection = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>

    {/* Tokens neutros */}
    <div>
      <p style={{ fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-xs)' }}>Tokens neutros</p>
      <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
        Toda a interface fora do sistema de condições: textos, fundos, bordas, navegação e estados de loading.
      </p>
      <div style={{ marginBottom: 'var(--spacing-md)' }}>
        <ColorTable tokens={colorTokens.text} />
      </div>
      <div style={{ marginBottom: 'var(--spacing-md)' }}>
        <ColorTable tokens={colorTokens.surface} />
      </div>
      <ColorTable tokens={colorTokens.border} />
    </div>

    {/* Tokens de condição */}
    <div>
      <p style={{ fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-xs)' }}>Tokens de condição</p>
      <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
        Usados exclusivamente para indicar qualidade do mar. Cada condição tem 3 variantes: <code style={{ fontFamily: 'monospace' }}>--text-*</code> para texto sobre fundo neutro, <code style={{ fontFamily: 'monospace' }}>--surface-*-solid</code> para fundos opacos e <code style={{ fontFamily: 'monospace' }}>--surface-*-gradient</code> para fundos translúcidos.
      </p>
      <div style={{ marginBottom: 'var(--spacing-md)' }}>
        <ColorTable tokens={colorTokens.conditions} />
      </div>
      <ColorTable tokens={colorTokens.surfaceConditions} />
    </div>

  </div>
);

const ColorTable = ({ tokens }) => (
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <thead>
      <tr style={{ borderBottom: '1px solid var(--border-primary)', textAlign: 'left' }}>
        <Th>Swatch</Th>
        <Th>Figma Variable</Th>
        <Th>CSS Variable</Th>
        <Th>Valor atual</Th>
      </tr>
    </thead>
    <tbody>
      {tokens.map(t => (
        <tr key={t.name} style={{ borderBottom: '1px solid var(--border-primary)' }}>
          <td style={{ padding: '12px 0' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 'var(--radius-minimal)',
              background: `var(--${t.name})`,
              border: '1px solid var(--border-primary)',
            }} />
          </td>
          <td style={{ padding: 'var(--spacing-sm) 0', fontSize: 'var(--font-size-body)', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{t.figma}</td>
          <td style={{ padding: 'var(--spacing-sm) 0', fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-bold)' }}>--{t.name}</td>
          <td style={{ padding: 'var(--spacing-sm) 0', fontSize: 'var(--font-size-subtitle)', fontFamily: 'monospace' }}>{getCSSVar(`--${t.name}`)}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

// --- Typography ---

const typographyTokens = [
  { name: 'Title', sizeVar: '--font-size-title', weightVar: '--font-weight-bold', className: 'text-token-title' },
  { name: 'Title sm', sizeVar: '--font-size-title-sm', weightVar: '--font-weight-bold', className: 'text-token-title-sm' },
  { name: 'Headline', sizeVar: '--font-size-headline', weightVar: '--font-weight-bold', className: 'text-token-headline' },
  { name: 'Button label', sizeVar: '--font-size-button', weightVar: '--font-weight-bold', className: 'text-token-button' },
  { name: 'Input label', sizeVar: '--font-size-input-label', weightVar: '--font-weight-regular', className: 'text-token-input-label' },
  { name: 'Body', sizeVar: '--font-size-body', weightVar: '--font-weight-regular', className: 'text-token-body' },
  { name: 'Subtitle', sizeVar: '--font-size-subtitle', weightVar: '--font-weight-regular', className: 'text-token-subtitle' },
  { name: 'Subtitle bold', sizeVar: '--font-size-subtitle', weightVar: '--font-weight-bold', className: 'text-token-subtitle-bold' },
];

const TypographySection = () => (
  <div>
    <div style={{
      background: 'var(--surface-terciary)',
      borderRadius: 'var(--radius-minimal)',
      padding: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)',
    }}>
      <p style={{ fontSize: 'var(--font-size-subtitle)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xs)', fontFamily: 'monospace' }}>
        font-family
      </p>
      <p style={{ fontSize: 'var(--font-size-title-sm)', fontWeight: 'var(--font-weight-bold)' }}>Space Grotesk</p>
      <p style={{ fontSize: 'var(--font-size-subtitle)', color: 'var(--text-secondary)', marginTop: 'var(--spacing-xs)', fontFamily: 'monospace' }}>--font-family · Weights: 400, 700</p>
    </div>
    <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
      Cada classe token encapsula tamanho e peso juntos — nunca aplicar <code style={{ fontFamily: 'monospace' }}>font-size</code> e <code style={{ fontFamily: 'monospace' }}>font-weight</code> separadamente em componentes. As variáveis CSS (<code style={{ fontFamily: 'monospace' }}>--font-size-*</code>, <code style={{ fontFamily: 'monospace' }}>--font-weight-*</code>) são reservadas para contextos sem acesso a classes, como SVG labels e estilos inline no Recharts.
    </p>

    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--border-primary)', textAlign: 'left' }}>
          <Th>Figma Variable</Th>
          <Th>CSS Variable</Th>
          <Th>Value</Th>
          <Th>Amostra</Th>
        </tr>
      </thead>
      <tbody>
        {typographyTokens.map(t => (
          <tr key={t.name + t.className} style={{ borderBottom: '1px solid var(--border-primary)' }}>
            <td style={{ padding: 'var(--spacing-md) 0', fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-bold)' }}>{t.name}</td>
            <td style={{ padding: 'var(--spacing-md) 0', fontSize: 'var(--font-size-subtitle)', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
              {t.sizeVar} / {t.weightVar}
            </td>
            <td style={{ padding: 'var(--spacing-md) 0', fontSize: 'var(--font-size-subtitle)', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
              {getCSSVar(t.sizeVar)} · {getCSSVar(t.weightVar)}
            </td>
            <td style={{ padding: 'var(--spacing-md) 0', fontSize: `var(${t.sizeVar})`, fontWeight: `var(${t.weightVar})`, fontFamily: 'var(--font-family)' }}>
              Swell Check
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// --- Spacing ---

const spacingTokens = [
  { name: 'spacing-none', figma: 'spacing/spacing-none' },
  { name: 'spacing-xs', figma: 'spacing/spacing-xs' },
  { name: 'spacing-sm', figma: 'spacing/spacing-sm' },
  { name: 'spacing-md', figma: 'spacing/spacing-md' },
  { name: 'spacing-lg', figma: 'spacing/spacing-lg' },
  { name: 'spacing-xl', figma: 'spacing/spacing-xl' },
];

const SpacingSection = () => (
  <div>
    <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
      Nunca usar valores de pixel avulsos em componentes reutilizáveis — sempre <code style={{ fontFamily: 'monospace' }}>var(--spacing-*)</code>. Exceção: <code style={{ fontFamily: 'monospace' }}>padding-top: 40px</code> e <code style={{ fontFamily: 'monospace' }}>padding-bottom: 80px</code> nos layouts de página (HomeScreen, BeachPage), que ainda não têm token formal.
    </p>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--border-primary)', textAlign: 'left' }}>
          <Th>Figma Variable</Th>
          <Th>CSS Variable</Th>
          <Th>Value</Th>
          <Th>Preview</Th>
        </tr>
      </thead>
      <tbody>
        {spacingTokens.map(t => (
          <tr key={t.name} style={{ borderBottom: '1px solid var(--border-primary)' }}>
            <td style={{ padding: 'var(--spacing-md) 0', fontSize: 'var(--font-size-body)', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{t.figma}</td>
            <td style={{ padding: 'var(--spacing-md) 0', fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-bold)' }}>--{t.name}</td>
            <td style={{ padding: 'var(--spacing-md) 0', fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-bold)' }}>{getCSSVar(`--${t.name}`)}</td>
            <td style={{ padding: 'var(--spacing-md) 0' }}>
              <div style={{ width: `max(var(--${t.name}), 2px)`, height: 20, background: 'var(--text-primary)', borderRadius: 2 }} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// --- Radius ---

const radiusTokens = [
  { name: 'radius-minimal', figma: 'radius/radius-minimal' },
  { name: 'radius-rounded', figma: 'radius/radius-rounded' },
  { name: 'radius-full', figma: 'radius/radius-full' },
];

const RadiusSection = () => (
  <div>
    <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
      Cada componente tem um token de radius atribuído — não escolher por preferência visual. <code style={{ fontFamily: 'monospace' }}>--radius-full</code> está definido no sistema mas sem uso em nenhum componente atual.
    </p>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--border-primary)', textAlign: 'left' }}>
          <Th>Figma Variable</Th>
          <Th>CSS Variable</Th>
          <Th>Value</Th>
          <Th>Preview</Th>
        </tr>
      </thead>
      <tbody>
        {radiusTokens.map(t => (
          <tr key={t.name} style={{ borderBottom: '1px solid var(--border-primary)' }}>
            <td style={{ padding: 'var(--spacing-md) 0', fontSize: 'var(--font-size-body)', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{t.figma}</td>
            <td style={{ padding: 'var(--spacing-md) 0', fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-bold)' }}>--{t.name}</td>
            <td style={{ padding: 'var(--spacing-md) 0', fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-bold)' }}>{getCSSVar(`--${t.name}`)}</td>
            <td style={{ padding: 'var(--spacing-md) 0' }}>
              <div style={{ width: 48, height: 48, background: 'var(--text-primary)', borderRadius: `var(--${t.name})` }} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* =========================================
   COMPONENTES
   ========================================= */

const BadgesSection = () => (
  <div>
    <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
      Exclusivo para indicar veredito de condição do mar. Aparece no BeachCard (condição diária) e na BeachPage (condição horária). Não usar como tag de categoria, indicador de status de sistema ou para qualquer finalidade não relacionada ao mar.
    </p>

    <SectionTitle>default — body-bold</SectionTitle>
    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap', marginBottom: 'var(--spacing-lg)' }}>
      <Badge variant="storm">Storm</Badge>
      <Badge variant="bom">Bom</Badge>
      <Badge variant="marola">Marola</Badge>
      <Badge variant="flat">Flat</Badge>
    </div>

    <SectionTitle>small — subtitle-bold</SectionTitle>
    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap', marginBottom: 'var(--spacing-lg)' }}>
      <Badge variant="storm" size="small">Storm</Badge>
      <Badge variant="bom" size="small">Bom</Badge>
      <Badge variant="marola" size="small">Marola</Badge>
      <Badge variant="flat" size="small">Flat</Badge>
    </div>

    <SectionTitle>Figma Specs</SectionTitle>
    <table style={{ width: '100%', borderCollapse: 'collapse', maxWidth: 500 }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--border-primary)', textAlign: 'left' }}>
          <Th>Prop</Th>
          <Th>default</Th>
          <Th>small</Th>
        </tr>
      </thead>
      <tbody>
        <SpecRow label="Font" value="text-token-body-bold · 14px/700" value2="text-token-subtitle-bold · 11px/700" />
        <SpecRow label="Border Radius" value="var(--radius-minimal) · 8px" />
        <SpecRow label="Padding X" value="var(--spacing-sm) · 8px" />
        <SpecRow label="Padding Y" value="var(--spacing-xs) · 4px" />
        <SpecRow label="Border" value="none" />
      </tbody>
    </table>
  </div>
);

const ButtonsSection = () => (
  <div>
    <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
      <strong>default</strong> — ação primária ("Aplicar", "Filtrar por data"). <strong>outline</strong> — ação secundária ("Cancelar", setas de navegação de data). <strong>ghost</strong> — ação sem peso visual (back e share no Header). Para <code style={{ fontFamily: 'monospace' }}>size="icon"</code> em ações isoladas, sempre sobrescrever para <code style={{ fontFamily: 'monospace' }}>h-[var(--touch-target)] w-[var(--touch-target)]</code> (44px) — o padrão do shadcn tem 40px.
    </p>
    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button>Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button size="icon" className="rounded-full"><Heart size={16} /></Button>
    </div>
  </div>
);

const InputsSection = () => (
  <div style={{ maxWidth: 320 }}>
    <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
      Exclusivo para busca de praias na HomeScreen. Sempre com ícone <code style={{ fontFamily: 'monospace' }}>Search</code> à esquerda e botão × de limpar quando há texto. Aparece em par com o trigger do DateFilterModal, em <code style={{ fontFamily: 'monospace' }}>flex</code> com o Input ocupando <code style={{ fontFamily: 'monospace' }}>flex: 1</code>.
    </p>
    <div style={{ position: 'relative' }}>
      <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
      <Input className="pl-11 h-12" placeholder="Buscar praia" />
    </div>
  </div>
);

const CardsSection = () => (
  <div style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
    <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
      Componente de domínio — representa uma praia na lista da HomeScreen. Toque em qualquer área navega para a BeachPage. Não usar para representar outro tipo de conteúdo.
    </p>

    <div>
      <p style={{ fontSize: 'var(--font-size-subtitle)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>Storm</p>
      <BeachCard
        name="Cacimba do Padre"
        state="PE"
        country="Brasil"
        height="3.5"
        condition="storm"
        label="Storm"
      />
    </div>

    <div>
      <p style={{ fontSize: 'var(--font-size-subtitle)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>Bom</p>
      <BeachCard
        name="Maracaípe"
        state="PE"
        country="Brasil"
        height="1.5"
        condition="bom"
        label="Bom"
      />
    </div>

    <div>
      <p style={{ fontSize: 'var(--font-size-subtitle)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>Marola</p>
      <BeachCard
        name="Itapuama"
        state="PE"
        country="Brasil"
        height="0.8"
        condition="marola"
        label="Marola"
      />
    </div>

    <div>
      <p style={{ fontSize: 'var(--font-size-subtitle)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>Flat</p>
      <BeachCard
        name="Paiva"
        state="PE"
        country="Brasil"
        height="0.3"
        condition="flat"
        label="Flat"
      />
    </div>
  </div>
);

const SliderSection = () => {
  const [value, setValue] = useState([50]);

  return (
    <div style={{ maxWidth: 400 }}>
      <SectionTitle>Time Slider</SectionTitle>
      <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
        Exclusivo para scrubbing de hora no TideChart dentro da BeachPage. Range de 0–24h em passos de 1 hora. Renderiza a escala temporal abaixo da track: <code style={{ fontFamily: 'monospace' }}>12am | 6am | 12pm | 6pm | 12am</code>.
      </p>
      <TimeSlider
        value={value[0]}
        onChange={(v) => setValue([v])}
      />
    </div>
  );
};

const InfoBlockSection = () => (
  <div>
    <SectionTitle>Info Block</SectionTitle>
    <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
      Sempre em grupo de três na BeachPage, com labels fixos: <strong>Altura total</strong>, <strong>Vento</strong> e <strong>Período</strong>. O label aparece acima do valor — o usuário lê primeiro o que é, depois o número. Não inverter. Não adaptar para outros tipos de dado.
    </p>
    <div style={{ display: 'flex', gap: 12, maxWidth: 400 }}>
      <InfoBlock label="Altura total" value="2.5m" />
      <InfoBlock label="Vento" value="45 km/h" />
      <InfoBlock label="Período" value="8s" />
    </div>
  </div>
);

const SwellPowerSection = () => (
  <div style={{ maxWidth: 400 }}>
    <SectionTitle>Swell Power Bar</SectionTitle>
    <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
      Barra de 5 segmentos que indica energia do swell em Kj. A cor dos segmentos ativos segue a condição: 1 → flat, 2 → marola, 3–4 → bom, 5 → storm. Segmentos inativos usam <code style={{ fontFamily: 'monospace' }}>--surface-terciary</code>. O label "Força do swell" é fixo e não parametrizado.
    </p>

    {/* Todos os estados */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SwellPowerBar value={1} label="120 kj" sublabel="Fraco" />
      <SwellPowerBar value={2} label="600 kj" sublabel="Médio" />
      <SwellPowerBar value={3} label="1,440 kj" sublabel="Bom" />
      <SwellPowerBar value={4} label="2,300 kj" sublabel="Forte" />
      <SwellPowerBar value={5} label="4,800 kj" sublabel="Muito forte" />
    </div>
  </div>
);

const HeaderSection = () => (
  <div style={{ maxWidth: 400 }}>
    <SectionTitle>Header</SectionTitle>
    <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
      Duas variantes: <strong>default</strong> exibe só o nome do app; <strong>beach</strong> tem botão back à esquerda, nome da praia centralizado e botão share (ou espaçador de simetria) à direita. Botões de ícone usam <code style={{ fontFamily: 'monospace' }}>h-[var(--touch-target)] w-[var(--touch-target)]</code> (44px). O espaçador mantém o título centralizado quando <code style={{ fontFamily: 'monospace' }}>showShare=false</code>.
    </p>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      <div>
        <p style={{ fontSize: 'var(--font-size-subtitle)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>default — Home</p>
        <div style={{ border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-minimal)', overflow: 'hidden' }}>
          <Header variant="default" />
        </div>
      </div>

      <div>
        <p style={{ fontSize: 'var(--font-size-subtitle)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>beach — Página interna (Dinâmico)</p>
        <div style={{ border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-minimal)', overflow: 'hidden', marginBottom: 12 }}>
          <Header variant="beach" title="Praia do Paiva" />
        </div>
        <p style={{ fontSize: 'var(--font-size-subtitle)', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Passando title="Praia do Paiva" e showShare=false (default)</p>
      </div>

      <div>
        <p style={{ fontSize: 'var(--font-size-subtitle)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>beach — Com Share Habilitado</p>
        <div style={{ border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-minimal)', overflow: 'hidden', marginBottom: 12 }}>
          <Header variant="beach" title="Itapuama" showShare={true} />
        </div>
        <p style={{ fontSize: 'var(--font-size-subtitle)', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Passando title="Itapuama" e showShare=true</p>
      </div>
    </div>
  </div>
);

const MOCK_TIDES = [
  { hour: '00:30', level: 0.4 },
  { hour: '06:32', level: 2.1 },
  { hour: '12:45', level: 0.3 },
  { hour: '18:58', level: 1.9 },
];

const ModalSection = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      {/* 1. Modal Nativo Shadcn */}
      <div style={{ maxWidth: 500 }}>
        <SectionTitle>1. Modal Padrão (Dialog Nativo)</SectionTitle>
        <p style={{ fontSize: 'var(--font-size-subtitle)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
          Estrutura padrão do shadcn/ui. Ideal para alertas, confirmações simples ou formulários genéricos.
        </p>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Ver Modal Padrão</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Título do Modal</DialogTitle>
              <DialogDescription>
                Esta é a descrição padrão do modal.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 text-body text-[var(--text-primary)]">
              Aqui vai o conteúdo principal do modal.
            </div>
            <DialogFooter>
              <Button variant="outline">Cancelar</Button>
              <Button>Confirmar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div style={{ height: 1, background: 'var(--border-primary)', width: '100%' }} />

      {/* 2. Modal de Filtro por Data */}
      <div style={{ maxWidth: 500 }}>
        <SectionTitle>2. Modal de Filtro (Componente Real)</SectionTitle>
        <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
          Aceita qualquer elemento como trigger e retorna a data selecionada via callback <code style={{ fontFamily: 'monospace' }}>onApply</code>. Datas disponíveis: hoje até hoje + 7 dias — fora desse range ficam desabilitadas no calendário. O botão "Hoje" fica desabilitado quando hoje já está selecionado.
        </p>

        <DateFilterModal
          initialDate={format(new Date(), 'yyyy-MM-dd')}
          onApply={(date) => alert(`Data aplicada: ${date}`)}
          trigger={<Button>Abrir Filtro de Data</Button>}
        />
      </div>
    </div>
  );
};

const CalendarSection = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div style={{ maxWidth: 400 }}>
      <SectionTitle>Calendar</SectionTitle>
      <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
        Calendário do shadcn/ui (react-day-picker) com classNames customizados alinhados ao design system. Usado exclusivamente dentro do DateFilterModal — não como componente independente no app.
      </p>

      <div style={{ display: 'inline-block', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-rounded)', overflow: 'hidden' }}>
        <Calendar
          mode="single"
          locale={ptBR}
          selected={date}
          onSelect={setDate}
          disabled={{ before: new Date() }}
          className="bg-[var(--surface-primary)]"
        />
      </div>

      <p style={{ marginTop: 'var(--spacing-md)', fontSize: 'var(--font-size-body)', color: 'var(--text-primary)' }}>
        Data selecionada: <strong>{date?.toLocaleDateString('pt-BR')}</strong>
      </p>
    </div>
  );
};

const TideChartSection = () => (
  <div style={{ maxWidth: 400 }}>
    <SectionTitle>Tide Chart</SectionTitle>
    <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
      Renderiza exclusivamente a curva de maré, dots de alta/baixa-mar e a linha vertical da hora atual. Título, label "Maré" e o TimeSlider são responsabilidade do componente pai. Retorna <code style={{ fontFamily: 'monospace' }}>null</code> se <code style={{ fontFamily: 'monospace' }}>tides</code> estiver vazio.
    </p>

    <div className="bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-[var(--radius-minimal)] p-[var(--spacing-md)]">
      <span style={{ fontSize: "var(--font-size-subtitle)", color: "var(--text-secondary)", fontWeight: "var(--font-weight-bold)", display: "block", marginBottom: 'var(--spacing-sm)' }}>Maré</span>
      <TideChart tides={MOCK_TIDES} currentHour={14} />
      <div className="mt-6">
        <TimeSlider value={14} onChange={() => { }} />
      </div>
    </div>
  </div>
);

/* =========================================
   SHARED
   ========================================= */

const SectionTitle = ({ children, style: extraStyle }) => (
  <p style={{
    fontSize: 'var(--font-size-body)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--text-secondary)',
    marginBottom: 'var(--spacing-md)',
    ...extraStyle,
  }}>
    {children}
  </p>
);

const Th = ({ children }) => (
  <th style={{ padding: 'var(--spacing-sm) 0', fontSize: 'var(--font-size-subtitle)', color: 'var(--text-secondary)', fontWeight: 'var(--font-weight-bold)' }}>
    {children}
  </th>
);

const SpecRow = ({ label, value, value2 }) => (
  <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
    <td style={{ padding: 'var(--spacing-sm) 0', fontSize: 'var(--font-size-body)', color: 'var(--text-secondary)' }}>{label}</td>
    <td style={{ padding: 'var(--spacing-sm) 0', fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'monospace' }}>{value}</td>
    {value2 !== undefined && (
      <td style={{ padding: 'var(--spacing-sm) 0', fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'monospace' }}>{value2}</td>
    )}
  </tr>
);

export default DesignSystem;
