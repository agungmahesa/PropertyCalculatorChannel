// Type definitions for ProfitStay

export interface DeductionItem {
    id: string;
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    isEnabled: boolean;
}

export interface DeductionComponent extends DeductionItem { } // Backwards compatibility if needed

export interface CalculationStep {
    deductionName: string;
    deductionType: 'percentage' | 'fixed';
    deductionValue: number;
    deductionAmount: number;
    remainingAmount: number;
}

export interface CalculationResult {
    sellingPrice: number;
    operationalCost: number;
    steps: CalculationStep[];
    netRevenue: number;
    netProfit: number;
    profitMargin: number;
    profitStatus: 'healthy' | 'low' | 'loss';
}

export interface CalculatorResult {
    netRevenue: number;
    totalDeductions: number;
    netProfit: number;
    profitMargin: number;
    profitStatus: 'healthy' | 'moderate' | 'low';
    breakdown: {
        item: DeductionItem;
        amount: number;
    }[];
}

export interface ComparisonResult {
    channel1: {
        name: string;
        sellingPrice: number;
        totalDeductions: number;
        netProfit: number;
        margin: number;
    };
    channel2: {
        name: string;
        sellingPrice: number;
        totalDeductions: number;
        netProfit: number;
        margin: number;
    };
    difference: {
        netProfit: number;
        margin: number;
    };
    monthlyImpact: {
        occupancy: number;
        totalRooms: number;
        monthlyDifference: number;
    };
}

export interface OccupancyAlert {
    totalRooms: number;
    bookedRooms: number;
    occupancyRate: number;
    threshold: number;
    recommendation: string;
    status: 'high' | 'low';
}

export interface PromoImpact {
    normalPrice: number;
    discountPercentage: number;
    discountedPrice: number;
    normalProfit: number;
    discountedProfit: number;
    profitDrop: number;
    profitDropPercentage: number;
    marginDifference: number;
    requiredOccupancyIncrease: number;
    additionalRoomsNeeded: number;
}
