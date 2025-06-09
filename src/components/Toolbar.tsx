import { Pointer, Map, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type Tool = 'pointer' | 'placing' | 'map';

interface ToolbarProps {
  activeTool: Tool;
  onToolSelect: (tool: Tool) => void;
  onSave: () => void;
  isSaving: boolean;
}

const Toolbar = ({ activeTool, onToolSelect, onSave, isSaving }: ToolbarProps) => (
  <div className="flex justify-between items-center p-2 border-b">
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
