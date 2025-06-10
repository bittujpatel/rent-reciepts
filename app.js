// Rent Intimation Receipt Generator App
class RentReceiptGenerator {
    constructor() {
        this.state = {
            building: '',
            room: '',
            month: 'June',
            rentAmount: 0,
            waterRate: 0.20,
            meters: {},
            additionalCharges: []
        };
        
        this.rooms = ['GF1', 'GF2', 'GF3', '101', '102', '103', '201', '202', '203', '301', '302', '303', '401', '402', '403'];
        this.chargeTypes = ['WiFi', 'Current Bill', 'Old Balance', 'Water Can', 'Grocery', 'Maintenance', 'Other'];
        
        this.init();
    }

    init() {
        this.populateRoomDropdown();
        this.setDefaultValues();
        this.bindEvents();
        this.updateReceipt();
    }

    setDefaultValues() {
        // Set default water rate
        const waterRateInput = document.getElementById('waterRate');
        if (waterRateInput) {
            waterRateInput.value = this.state.waterRate;
        }
        
        // Set default month
        const monthSelect = document.getElementById('month');
        if (monthSelect) {
            monthSelect.value = this.state.month;
        }
        
        // Initialize state from form values
        this.state.waterRate = parseFloat(waterRateInput?.value || 0.20);
        this.state.month = monthSelect?.value || 'June';
    }

    bindEvents() {
        // Building and room selection
        const buildingSelect = document.getElementById('building');
        const roomSelect = document.getElementById('room');
        const monthSelect = document.getElementById('month');
        const rentAmountInput = document.getElementById('rentAmount');
        const waterRateInput = document.getElementById('waterRate');

        if (buildingSelect) {
            buildingSelect.addEventListener('change', (e) => {
                this.state.building = e.target.value;
                this.updateRoomDisplay();
                this.updateReceipt();
            });
        }

        if (roomSelect) {
            roomSelect.addEventListener('change', (e) => {
                this.state.room = e.target.value;
                this.updateRoomDisplay();
                this.updateReceipt();
            });
        }

        // Month selection
        if (monthSelect) {
            monthSelect.addEventListener('change', (e) => {
                this.state.month = e.target.value;
                this.updateReceipt();
            });
        }

        // Rent and water rate
        if (rentAmountInput) {
            rentAmountInput.addEventListener('input', (e) => {
                this.state.rentAmount = parseFloat(e.target.value) || 0;
                this.updateReceipt();
            });
        }

        if (waterRateInput) {
            waterRateInput.addEventListener('input', (e) => {
                this.state.waterRate = parseFloat(e.target.value) || 0;
                this.updateReceipt();
            });
        }

        // Meter toggles
        document.querySelectorAll('.toggle-meter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const meterNum = e.target.getAttribute('data-meter') || e.target.closest('.toggle-meter').getAttribute('data-meter');
                this.toggleMeter(meterNum);
            });
        });

        // Meter inputs - Use event delegation for dynamic content
        document.addEventListener('input', (e) => {
            if (e.target.closest('.meter-config')) {
                const meterConfig = e.target.closest('.meter-config');
                const meterNum = meterConfig.getAttribute('data-meter');
                this.updateMeterCalculation(meterNum);
                this.updateReceipt();
            }
        });

        document.addEventListener('change', (e) => {
            if (e.target.closest('.meter-config')) {
                const meterConfig = e.target.closest('.meter-config');
                const meterNum = meterConfig.getAttribute('data-meter');
                this.updateMeterCalculation(meterNum);
                this.updateReceipt();
            }
        });

        // Additional charges
        const addChargeBtn = document.getElementById('addCharge');
        if (addChargeBtn) {
            addChargeBtn.addEventListener('click', () => {
                this.addAdditionalCharge();
            });
        }

        // Generate receipt
        const generateBtn = document.getElementById('generateReceipt');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.generateReceipt();
            });
        }

        // Print receipt
        const printBtn = document.getElementById('printReceipt');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                this.printReceipt();
            });
        }
    }

    populateRoomDropdown() {
        const roomSelect = document.getElementById('room');
        if (roomSelect) {
            roomSelect.innerHTML = '<option value="">Select Room</option>';
            
            this.rooms.forEach(room => {
                const option = document.createElement('option');
                option.value = room;
                option.textContent = room;
                roomSelect.appendChild(option);
            });
        }
    }

    updateRoomDisplay() {
        const display = document.getElementById('roomDisplay');
        const roomCode = display?.querySelector('.room-code');
        
        if (roomCode) {
            if (this.state.building && this.state.room) {
                roomCode.textContent = `${this.state.building}${this.state.room}`;
            } else {
                roomCode.textContent = 'Select Building & Room';
            }
        }
    }

    toggleMeter(meterNum) {
        const meterConfig = document.querySelector(`[data-meter="${meterNum}"]`);
        if (!meterConfig) return;

        const toggleBtn = meterConfig.querySelector('.toggle-meter');
        const meterFields = meterConfig.querySelector('.meter-fields');
        const toggleText = toggleBtn.querySelector('.toggle-text');

        const isCurrentlyHidden = meterFields.style.display === 'none' || 
                                   window.getComputedStyle(meterFields).display === 'none';

        if (isCurrentlyHidden) {
            // Show meter fields
            meterFields.style.display = 'block';
            toggleBtn.classList.add('active');
            toggleText.textContent = 'Disable';
            
            // Initialize meter state if not exists
            if (!this.state.meters[meterNum]) {
                this.state.meters[meterNum] = {
                    enabled: true,
                    type: 'Kitchen',
                    unitType: 1,
                    oldReading: 0,
                    newReading: 0,
                    usage: 0
                };
            } else {
                this.state.meters[meterNum].enabled = true;
            }
            
            // Update calculation immediately
            this.updateMeterCalculation(meterNum);
        } else {
            // Hide meter fields
            meterFields.style.display = 'none';
            toggleBtn.classList.remove('active');
            toggleText.textContent = 'Enable';
            
            if (this.state.meters[meterNum]) {
                this.state.meters[meterNum].enabled = false;
            }
        }
        
        this.updateReceipt();
    }

    updateMeterCalculation(meterNum) {
        const meterConfig = document.querySelector(`[data-meter="${meterNum}"]`);
        if (!meterConfig) return;

        const meterTypeEl = meterConfig.querySelector('.meter-type');
        const unitTypeEl = meterConfig.querySelector('.unit-type');
        const oldReadingEl = meterConfig.querySelector('.old-reading');
        const newReadingEl = meterConfig.querySelector('.new-reading');
        const usageDisplay = meterConfig.querySelector('.usage-display');

        if (!meterTypeEl || !unitTypeEl || !oldReadingEl || !newReadingEl || !usageDisplay) return;

        const meterType = meterTypeEl.value;
        const unitType = parseInt(unitTypeEl.value);
        const oldReading = parseFloat(oldReadingEl.value) || 0;
        const newReading = parseFloat(newReadingEl.value) || 0;
        
        const rawUsage = Math.max(0, newReading - oldReading);
        const usage = rawUsage * unitType;
        
        // Update state
        this.state.meters[meterNum] = {
            enabled: true,
            type: meterType,
            unitType: unitType,
            oldReading: oldReading,
            newReading: newReading,
            usage: usage,
            rawUsage: rawUsage
        };
        
        // Update display
        if (unitType === 10) {
            usageDisplay.textContent = `Usage: ${rawUsage} × 10 = ${usage} liters`;
        } else {
            usageDisplay.textContent = `Usage: ${usage} liters`;
        }
    }

    addAdditionalCharge() {
        const chargeId = Date.now();
        const chargeContainer = document.getElementById('additionalCharges');
        if (!chargeContainer) return;
        
        const chargeItem = document.createElement('div');
        chargeItem.className = 'charge-item';
        chargeItem.setAttribute('data-charge-id', chargeId);
        
        chargeItem.innerHTML = `
            <div class="form-group">
                <label class="form-label">Charge Type</label>
                <select class="form-control charge-type">
                    ${this.chargeTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Amount (₹)</label>
                <input type="number" class="form-control charge-amount" placeholder="0" min="0">
            </div>
            <button type="button" class="remove-charge">Remove</button>
        `;
        
        chargeContainer.appendChild(chargeItem);
        
        // Add event listeners
        const typeSelect = chargeItem.querySelector('.charge-type');
        const amountInput = chargeItem.querySelector('.charge-amount');
        const removeBtn = chargeItem.querySelector('.remove-charge');
        
        typeSelect.addEventListener('change', () => {
            this.updateAdditionalCharges();
        });
        
        amountInput.addEventListener('input', () => {
            this.updateAdditionalCharges();
        });
        
        removeBtn.addEventListener('click', () => {
            chargeItem.remove();
            this.updateAdditionalCharges();
        });
        
        this.updateAdditionalCharges();
    }

    updateAdditionalCharges() {
        const chargeItems = document.querySelectorAll('.charge-item');
        this.state.additionalCharges = [];
        
        chargeItems.forEach(item => {
            const type = item.querySelector('.charge-type').value;
            const amount = parseFloat(item.querySelector('.charge-amount').value) || 0;
            
            if (amount > 0) {
                this.state.additionalCharges.push({ type, amount });
            }
        });
        
        this.updateReceipt();
    }

    calculateWaterCharges() {
        let totalUsage = 0;
        Object.values(this.state.meters).forEach(meter => {
            if (meter.enabled) {
                totalUsage += meter.usage;
            }
        });
        
        return {
            totalUsage: totalUsage,
            totalAmount: totalUsage * this.state.waterRate
        };
    }

    calculateTotalAmount() {
        const waterCharges = this.calculateWaterCharges();
        let total = this.state.rentAmount + waterCharges.totalAmount;
        
        this.state.additionalCharges.forEach(charge => {
            total += charge.amount;
        });
        
        return total;
    }

    updateReceipt() {
        // Update basic details
        const roomText = this.state.building && this.state.room ? 
            `${this.state.building}${this.state.room}` : '-';
        const monthText = this.state.month ? `${this.state.month} 2025` : '-';
        
        const receiptRoom = document.getElementById('receiptRoom');
        const receiptMonth = document.getElementById('receiptMonth');
        
        if (receiptRoom) receiptRoom.textContent = roomText;
        if (receiptMonth) receiptMonth.textContent = monthText;
        
        // Update water meters section
        this.updateWaterMetersReceipt();
        
        // Update charges breakdown
        this.updateChargesBreakdown();
    }

    updateWaterMetersReceipt() {
        const container = document.getElementById('receiptWaterMeters');
        if (!container) return;

        const enabledMeters = Object.entries(this.state.meters).filter(([_, meter]) => meter.enabled);
        
        if (enabledMeters.length === 0) {
            container.innerHTML = '<div class="no-meters">No water meters configured</div>';
            return;
        }
        
        let html = '';
        enabledMeters.forEach(([meterNum, meter]) => {
            const multiplierText = meter.unitType === 10 ? ' (×10 Multiplier)' : ' (Regular)';
            html += `
                <div class="meter-detail">
                    <div class="meter-title">Meter ${meterNum}: ${meter.type}${multiplierText}</div>
                    <div class="meter-calculation-detail">Previous Reading: ${meter.oldReading}</div>
                    <div class="meter-calculation-detail">Current Reading: ${meter.newReading}</div>
                    ${meter.unitType === 10 ? 
                        `<div class="meter-calculation-detail">Raw Usage: ${meter.newReading} - ${meter.oldReading} = ${meter.rawUsage}</div>
                         <div class="meter-calculation-detail">Final Usage: ${meter.rawUsage} × 10 = ${meter.usage} liters</div>` :
                        `<div class="meter-calculation-detail">Usage: ${meter.newReading} - ${meter.oldReading} = ${meter.usage} liters</div>`
                    }
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    updateChargesBreakdown() {
        const waterCharges = this.calculateWaterCharges();
        const total = this.calculateTotalAmount();
        
        // Update rent amount
        const receiptRent = document.getElementById('receiptRent');
        if (receiptRent) {
            receiptRent.textContent = `₹${this.state.rentAmount.toFixed(2)}`;
        }
        
        // Update water charges
        const waterChargeRow = document.querySelector('.water-charge-row');
        const waterDetails = document.getElementById('waterDetails');
        const receiptWaterCharges = document.getElementById('receiptWaterCharges');
        
        if (waterCharges.totalUsage > 0) {
            if (waterChargeRow) waterChargeRow.style.display = 'flex';
            if (waterDetails) waterDetails.style.display = 'block';
            
            if (receiptWaterCharges) {
                receiptWaterCharges.textContent = `₹${waterCharges.totalAmount.toFixed(2)}`;
            }
            
            if (waterDetails) {
                waterDetails.innerHTML = `
                    <div>Total Liters: ${waterCharges.totalUsage}</div>
                    <div>Rate: ₹${this.state.waterRate} per liter</div>
                    <div>Amount: ${waterCharges.totalUsage} × ₹${this.state.waterRate} = ₹${waterCharges.totalAmount.toFixed(2)}</div>
                `;
            }
        } else {
            if (waterChargeRow) waterChargeRow.style.display = 'none';
            if (waterDetails) waterDetails.style.display = 'none';
        }
        
        // Update additional charges
        const additionalContainer = document.getElementById('additionalChargesReceipt');
        if (additionalContainer) {
            let additionalHtml = '';
            
            this.state.additionalCharges.forEach(charge => {
                additionalHtml += `
                    <div class="charge-row">
                        <span class="charge-label">${charge.type}:</span>
                        <span class="charge-value">₹${charge.amount.toFixed(2)}</span>
                    </div>
                `;
            });
            
            additionalContainer.innerHTML = additionalHtml;
        }
        
        // Update total
        const receiptTotal = document.getElementById('receiptTotal');
        if (receiptTotal) {
            receiptTotal.textContent = `₹${total.toFixed(2)}`;
        }
    }

    generateReceipt() {
        // Validate required fields
        if (!this.state.building || !this.state.room) {
            this.showAlert('Please select building and room', 'error');
            return;
        }
        
        if (!this.state.month) {
            this.showAlert('Please select month', 'error');
            return;
        }
        
        if (this.state.rentAmount <= 0) {
            this.showAlert('Please enter rent amount', 'error');
            return;
        }
        
        // Receipt is automatically updated, just scroll to it
        const receiptSection = document.querySelector('.receipt-section');
        if (receiptSection) {
            receiptSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Show success message
        this.showAlert('Receipt generated successfully!', 'success');
    }

    showAlert(message, type = 'info') {
        // Create a simple alert system
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;
        
        if (type === 'success') {
            alertDiv.style.background = 'linear-gradient(135deg, #10B981, #059669)';
        } else if (type === 'error') {
            alertDiv.style.background = 'linear-gradient(135deg, #EF4444, #DC2626)';
        } else {
            alertDiv.style.background = 'linear-gradient(135deg, #3B82F6, #2563EB)';
        }
        
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            alertDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.parentNode.removeChild(alertDiv);
                }
            }, 300);
        }, 3000);
    }

    printReceipt() {
        window.print();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RentReceiptGenerator();
});