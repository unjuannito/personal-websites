import type { LayoutConfig, SearchSettings } from '../../types';

interface GeneralSettingsProps {
  layout: LayoutConfig;
  onLayoutChange: (newLayout: LayoutConfig) => void;
  searchSettings: SearchSettings;
  onSearchSettingsChange: (settings: SearchSettings) => void;
}

const SEARCH_ENGINES = [
  { name: 'Google', url: 'https://www.google.com/search?q=' },
  { name: 'Bing', url: 'https://www.bing.com/search?q=' },
  { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
];

const AI_ENGINES = [
  { name: 'ChatGPT', url: 'https://chatgpt.com/?q=' },
  { name: 'Claude', url: 'https://claude.ai/new?q=' },
  { name: 'Perplexity', url: 'https://www.perplexity.ai/?q=' },
  { name: 'Google AI', url: 'https://www.google.com/ai?q=' },
];

export default function GeneralSettings({ 
  layout, 
  onLayoutChange, 
  searchSettings, 
  onSearchSettingsChange 
}: GeneralSettingsProps) {
  return (
    <main className="p-4 md:p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start content-start">
      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Search & AI</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
            <span className="font-medium">Search Engine</span>
            <select 
              value={searchSettings.searchEngine}
              onChange={(e) => onSearchSettingsChange({ ...searchSettings, searchEngine: e.target.value })}
              className="bg-black/20 border border-white/10 rounded-lg px-3 py-1 text-sm outline-none"
            >
              {SEARCH_ENGINES.map(engine => (
                <option key={engine.name} value={engine.url}>{engine.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
            <span className="font-medium">AI Engine</span>
            <select 
              value={searchSettings.aiEngine}
              onChange={(e) => onSearchSettingsChange({ ...searchSettings, aiEngine: e.target.value })}
              className="bg-black/20 border border-white/10 rounded-lg px-3 py-1 text-sm outline-none"
            >
              {AI_ENGINES.map(ai => (
                <option key={ai.name} value={ai.url}>{ai.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
            <span className="font-medium">Blurred Background</span>
            <button
              onClick={() => onSearchSettingsChange({ ...searchSettings, showBlur: !searchSettings.showBlur })}
              className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${searchSettings.showBlur ? 'bg-blue-500' : 'bg-zinc-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${searchSettings.showBlur ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Grid Configuration</h3>
        <div className="flex flex-col gap-3">
          {(['pc', 'tablet', 'mobile'] as const).map(device => (
            <div key={device} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
              <span className="font-medium capitalize">{device}</span>
              <div className="flex gap-4">
                <label className="flex flex-col items-center">
                  <span className="text-[10px] text-white/40 uppercase mb-1">Max Cols</span>
                  <input
                    type="number"
                    value={layout[device].cols}
                    onChange={e => onLayoutChange({ ...layout, [device]: { ...layout[device], cols: parseInt(e.target.value) || 1 } })}
                    className="w-16 bg-black/20 border border-white/10 rounded-lg px-2 py-1 text-center"
                  />
                </label>
                <label className="flex flex-col items-center">
                  <span className="text-[10px] text-white/40 uppercase mb-1">Max Rows</span>
                  <input
                    type="number"
                    value={layout[device].rows}
                    onChange={e => onLayoutChange({ ...layout, [device]: { ...layout[device], rows: parseInt(e.target.value) || 1 } })}
                    className="w-16 bg-black/20 border border-white/10 rounded-lg px-2 py-1 text-center"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
