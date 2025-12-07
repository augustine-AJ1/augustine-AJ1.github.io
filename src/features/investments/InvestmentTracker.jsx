import { useState, useEffect } from 'react';
import { Card, Button, Input } from '../../components/ui/Core';
import { InvestmentService, AuthService } from '../../services/mockService';

export default function InvestmentTracker() {
    const [portfolio, setPortfolio] = useState([]);
    const [newAsset, setNewAsset] = useState({ assetName: '', quantity: 0, purchasePrice: 0, currentValue: 0 });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const userId = AuthService.currentUser?.uid;
        if (userId) {
            const data = await InvestmentService.getAll(userId);
            setPortfolio(data);
        }
    };

    const addAsset = async (e) => {
        e.preventDefault();
        if (!newAsset.assetName) return;

        await InvestmentService.create({
            userId: AuthService.currentUser?.uid,
            ...newAsset,
            lastUpdated: new Date().toISOString()
        });
        setNewAsset({ assetName: '', quantity: 0, purchasePrice: 0, currentValue: 0 });
        loadData();
    };

    const deleteAsset = async (id) => {
        if (confirm('Remove this asset?')) {
            await InvestmentService.delete(id);
            loadData();
        }
    };

    const totalValue = portfolio.reduce((acc, p) => acc + (p.quantity * p.currentValue), 0);
    const totalCost = portfolio.reduce((acc, p) => acc + (p.quantity * p.purchasePrice), 0);
    const totalPL = totalValue - totalCost;
    const plPercentage = totalCost > 0 ? (totalPL / totalCost) * 100 : 0;

    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-2xl font-bold text-[var(--text-main)]">Investment Portfolio</h2>
            </header>

            {/* Portfolio Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <p className="text-[var(--text-muted)] text-sm">Portfolio Value</p>
                    <p className="text-3xl font-bold text-[var(--primary)]">AED {totalValue.toLocaleString()}</p>
                </Card>
                <Card>
                    <p className="text-[var(--text-muted)] text-sm">Total Invested</p>
                    <p className="text-3xl font-bold text-[var(--text-main)]">AED {totalCost.toLocaleString()}</p>
                </Card>
                <Card>
                    <p className="text-[var(--text-muted)] text-sm">Total Profit/Loss</p>
                    <p className={`text-3xl font-bold ${totalPL >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                        {totalPL >= 0 ? '+' : ''}AED {totalPL.toLocaleString()}
                        <span className="text-sm ml-2">({plPercentage.toFixed(2)}%)</span>
                    </p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Asset List */}
                <div className="lg:col-span-2 space-y-4">
                    <Card title="Your Assets">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[var(--text-muted)] text-sm border-b border-[var(--border)]">
                                        <th className="p-3">Asset</th>
                                        <th className="p-3">Quantity</th>
                                        <th className="p-3">Avg Price</th>
                                        <th className="p-3">Current Price</th>
                                        <th className="p-3">Value</th>
                                        <th className="p-3">P/L</th>
                                        <th className="p-3"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {portfolio.length === 0 ? (
                                        <tr><td colSpan="7" className="p-4 text-center text-[var(--text-muted)]">No assets found.</td></tr>
                                    ) : portfolio.map(asset => {
                                        const value = asset.quantity * asset.currentValue;
                                        const pl = value - (asset.quantity * asset.purchasePrice);
                                        return (
                                            <tr key={asset.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-app)] transition-colors">
                                                <td className="p-3 font-medium">{asset.assetName}</td>
                                                <td className="p-3">{asset.quantity}</td>
                                                <td className="p-3">{asset.purchasePrice.toFixed(2)}</td>
                                                <td className="p-3">{asset.currentValue.toFixed(2)}</td>
                                                <td className="p-3 font-bold">{value.toLocaleString()}</td>
                                                <td className={`p-3 ${pl >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                                                    {pl >= 0 ? '+' : ''}{pl.toLocaleString()}
                                                </td>
                                                <td className="p-3 text-right">
                                                    <button
                                                        className="text-[var(--text-muted)] hover:text-[var(--danger)]"
                                                        onClick={() => deleteAsset(asset.id)}
                                                    >×</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Add Asset Form */}
                <div>
                    <Card title="Add New Asset">
                        <form onSubmit={addAsset} className="space-y-4">
                            <Input
                                label="Asset Name"
                                placeholder="e.g. AAPL, Gold, Bitcoin"
                                value={newAsset.assetName}
                                onChange={e => setNewAsset({ ...newAsset, assetName: e.target.value })}
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Quantity"
                                    type="number"
                                    step="0.001"
                                    value={newAsset.quantity}
                                    onChange={e => setNewAsset({ ...newAsset, quantity: parseFloat(e.target.value) })}
                                    required
                                />
                                <Input
                                    label="Buy Price"
                                    type="number"
                                    step="0.01"
                                    value={newAsset.purchasePrice}
                                    onChange={e => setNewAsset({ ...newAsset, purchasePrice: parseFloat(e.target.value) })}
                                    required
                                />
                            </div>
                            <Input
                                label="Current Market Price"
                                type="number"
                                step="0.01"
                                value={newAsset.currentValue}
                                onChange={e => setNewAsset({ ...newAsset, currentValue: parseFloat(e.target.value) })}
                                required
                            />
                            <Button type="submit" className="w-full">Add to Portfolio</Button>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}
