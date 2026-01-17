import { useState, useEffect } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Trash2, Plus, Gift, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSpinWheel() {
    const { spinWheelRewards, updateSpinWheelRewards } = useStore();
    const [localRewards, setLocalRewards] = useState(spinWheelRewards);
    const [newReward, setNewReward] = useState({ label: '' });

    // Sync local state with global state on mount (or if global changes externally)
    useEffect(() => {
        setLocalRewards(spinWheelRewards);
    }, [spinWheelRewards]);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReward.label.trim()) return;

        // Alternate colors for aesthetic properly based on LOCAL length
        const isBlack = localRewards.length % 2 === 0;

        const newItem = {
            id: Date.now().toString(),
            label: newReward.label,
            color: isBlack ? '#18181b' : '#ffffff',
            textColor: isBlack ? '#ffffff' : '#000000',
        };

        setLocalRewards([...localRewards, newItem]);
        setNewReward({ label: '' });
        // Removed auto-toast, user needs to save
    };

    const handleRemove = (id: string) => {
        setLocalRewards(prev => prev.filter(r => r.id !== id));
    };

    const handleSave = () => {
        updateSpinWheelRewards(localRewards);
        toast.success('Spin Wheel changes saved successfully');
    };

    return (
        <div className="space-y-8 p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-medium tracking-tight">Spin Wheel Management</h1>
                    <p className="text-muted-foreground mt-2">Manage the rewards available in the post-purchase "Spin to Win".</p>
                </div>
                <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-6">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* ADD FORM */}
                <div className="bg-card border border-border p-8 shadow-sm">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Plus className="w-5 h-5" /> Add New Reward
                    </h3>
                    <form onSubmit={handleAdd} className="space-y-6">
                        <div className="space-y-2">
                            <Label>Product Name / Reward Label</Label>
                            <Input
                                placeholder="e.g. Leather Wallet"
                                value={newReward.label}
                                onChange={e => setNewReward({ label: e.target.value })}
                                className="rounded-none border-border"
                                maxLength={15}
                            />
                            <p className="text-xs text-muted-foreground">Please enter a physical product name. Max 15 chars.</p>
                        </div>
                        <Button type="submit" className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90">
                            Add to List (Unsaved)
                        </Button>
                    </form>
                </div>

                {/* LIST */}
                <div className="bg-muted/30 border border-border p-8">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Gift className="w-5 h-5" /> Active Rewards
                        <span className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">{localRewards.length} Items</span>
                    </h3>

                    <div className="space-y-2">
                        {localRewards.map((reward) => (
                            <div key={reward.id} className="flex items-center justify-between bg-card p-4 border border-border shadow-sm transition-all hover:shadow-md">
                                <div className="flex items-center gap-4">
                                    <div className="w-4 h-4 rounded-full border border-border" style={{ background: reward.color }}></div>
                                    <span className="font-medium">{reward.label}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemove(reward.id)}
                                    className="text-muted-foreground hover:text-destructive"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}

                        {localRewards.length === 0 && (
                            <p className="text-center text-muted-foreground py-4">No rewards active. The wheel will be empty.</p>
                        )}

                        {localRewards.length !== spinWheelRewards.length && (
                            <p className="text-center text-amber-600 text-sm py-2 bg-amber-50 mt-4 border border-amber-100">
                                You have unsaved changes. Click 'Save Changes' to update the live site.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
