import { Pointer, Map, Save, PanelRightOpen, PanelRightClose, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type Tool = 'pointer' | 'placing' | 'map';

interface ToolbarProps {
  activeTool: Tool;
  onToolSelect: (tool: Tool) => void;
  onSave: () => void;
  isSaving: boolean;
  isRightPanelVisible: boolean;
  onToggleRightPanel: () => void;
  onResetRightPanel: () => void;
}

const Toolbar = ({ 
  activeTool, 
  onToolSelect, 
  onSave, 
  isSaving, 
  isRightPanelVisible, 
  onToggleRightPanel,
  onResetRightPanel 
}: ToolbarProps) => (
  <div className="flex justify-between items-center p-2 border-b bg-white dark:bg-zinc-950">
    <div className="flex gap-2">
      <Button
        variant={activeTool === 'pointer' ? 'secondary' : 'ghost'}
        size="icon"
        onClick={() => onToolSelect('pointer')}
        aria-label="Pointer"
      >
        <Pointer className="h-5 w-5" />
      </Button>
    </div>
    <div className="flex gap-2">
      <Button
        variant={activeTool === 'map' ? 'secondary' : 'ghost'}
        size="icon"
        onClick={() => onToolSelect('map')}
        aria-label="Map"
      >
        <Map className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleRightPanel}
        aria-label={isRightPanelVisible ? "Скрыть правую панель" : "Показать правую панель"}
        title={isRightPanelVisible ? "Скрыть правую панель" : "Показать правую панель"}
      >
        {isRightPanelVisible ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onResetRightPanel}
        aria-label="Сбросить размер правой панели"
        title="Сбросить размер правой панели"
      >
        <RotateCcw className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onSave}
        aria-label="Save"
        disabled={isSaving}
      >
        <Save className="h-5 w-5" />
      </Button>
    </div>
  </div>
);

export default Toolbar;
