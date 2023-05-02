import React from 'react';
import {InvestmentCalculatorSection} from "./sections/investment-calculator.section";

export const ToolsPage = () => {
    return <div style={{ display: 'flex', padding: '20px', width: '100%', gap: '20px' }}>
        <div style={{ width: '50%'}}>
            <InvestmentCalculatorSection />
        </div>
        <div style={{ width: '50%'}}>TODO:</div>
    </div>
}
