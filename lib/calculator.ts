import { DeductionItem, CalculatorResult } from './types';

export function calculateChannelProfit(
    sellingPrice: number,
    deductions: DeductionItem[],
    operationalCost: number
): CalculatorResult {
    let totalDeductions = 0;
    const breakdown = [];

    // 1. Calculate Deductions
    for (const deduction of deductions) {
        if (!deduction.isEnabled) continue;

        let amount = 0;
        if (deduction.type === 'percentage') {
            amount = sellingPrice * (deduction.value / 100);
        } else {
            amount = deduction.value;
        }

        totalDeductions += amount;
        breakdown.push({
            item: deduction,
            amount: amount,
        });
    }

    const netRevenue = sellingPrice - totalDeductions;
    const netProfit = netRevenue - operationalCost;
    const profitMargin = (netProfit / sellingPrice) * 100;

    let profitStatus: 'healthy' | 'moderate' | 'low' = 'low';
    if (profitMargin >= 30) profitStatus = 'healthy';
    else if (profitMargin >= 15) profitStatus = 'moderate';

    return {
        netRevenue,
        totalDeductions,
        netProfit,
        profitMargin,
        profitStatus,
        breakdown,
    };
}

/**
 * Calculate occupancy rate and generate recommendation
 */
export function calculateOccupancy(
    totalRooms: number,
    bookedRooms: number,
    threshold: number = 70
) {
    const occupancyRate = (bookedRooms / totalRooms) * 100;

    let recommendation: string;
    let status: 'high' | 'low';

    if (occupancyRate > threshold) {
        status = 'high';
        recommendation = 'Demand is strong. Consider increasing price 5–10%.';
    } else {
        status = 'low';
        recommendation = 'Maintain or consider promotional pricing.';
    }

    return {
        totalRooms,
        bookedRooms,
        occupancyRate,
        threshold,
        recommendation,
        status,
    };
}

/**
 * Calculate promo impact and required compensation
 */
export function calculatePromoImpact(
    normalPrice: number,
    operationalCost: number,
    discountPercentage: number,
    deductions: DeductionItem[]
) {
    // Calculate normal profit
    const normalResult = calculateChannelProfit(normalPrice, deductions, operationalCost);

    // Calculate discounted profit
    const discountedPrice = normalPrice * (1 - discountPercentage / 100);
    const discountedResult = calculateChannelProfit(discountedPrice, deductions, operationalCost);

    const profitDrop = normalResult.netProfit - discountedResult.netProfit;
    const profitDropPercentage = normalResult.netProfit > 0
        ? (profitDrop / normalResult.netProfit) * 100
        : 0;
    const marginDifference = normalResult.profitMargin - discountedResult.profitMargin;

    // Calculate required occupancy increase
    const additionalRoomsNeeded = discountedResult.netProfit > 0
        ? Math.ceil(profitDrop / discountedResult.netProfit)
        : 0;

    return {
        normalPrice,
        discountPercentage,
        discountedPrice,
        normalProfit: normalResult.netProfit,
        discountedProfit: discountedResult.netProfit,
        profitDrop,
        profitDropPercentage,
        marginDifference,
        requiredOccupancyIncrease: additionalRoomsNeeded,
        additionalRoomsNeeded,
    };
}

/**
 * Format IDR currency
 */
export function formatIDR(amount: number): string {
    // Manual formatting to avoid hydration mismatch between server and client
    const formatted = Math.abs(amount).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const prefix = amount < 0 ? '-Rp' : 'Rp';
    return `${prefix}${formatted}`;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
}
