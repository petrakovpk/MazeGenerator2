import { Pointer, Map, Save, PanelRightOpen, PanelRightClose, RotateCcw } from 'lucide-react';

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
  <div className="navbar bg-base-100 shadow-sm border-b">
    <div className="navbar-start">
      <div className="btn-group">
        <button
          className={`btn btn-sm ${activeTool === 'pointer' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => onToolSelect('pointer')}
          data-tip="Указатель (выбор и перемещение объектов)"
        >
          <Pointer className="h-4 w-4" />
        </button>
      </div>
    </div>
    
    <div className="navbar-end">
      <div className="btn-group">
        <button
          className={`btn btn-sm ${activeTool === 'map' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => onToolSelect('map')}
          data-tip="Редактор карты"
        >
          <Map className="h-4 w-4" />
        </button>
        
        <div className="divider divider-horizontal mx-1"></div>
        
        <button
          className="btn btn-sm btn-ghost"
          onClick={onToggleRightPanel}
          data-tip={isRightPanelVisible ? "Скрыть правую панель" : "Показать правую панель"}
        >
          {isRightPanelVisible ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
        </button>
        
        <button
          className="btn btn-sm btn-ghost"
          onClick={onResetRightPanel}
          data-tip="Сбросить размер правой панели"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        
        <div className="divider divider-horizontal mx-1"></div>
        
        <button
          className="btn btn-sm btn-ghost"
          onClick={onSave}
          disabled={isSaving}
          data-tip={isSaving ? "Сохранение..." : "Сохранить уровень"}
        >
          <Save className="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
);

export default Toolbar;
