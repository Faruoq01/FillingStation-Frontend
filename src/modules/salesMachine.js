import APIs from '../services/api';
const events = require('events');

const SalesMachine = function(data){
    
    this.stateLabel = '';
    this.error = null;
    this.machine = this;
    this.events = new events.EventEmitter();
    this.data = data;

    this.start = () => {
        this.changeState('Sales', this);
    }

    this.changeState = (name, machine) => {
        if(name === 'done'){
            this.stateLabel = '';
            this.error = null;
            this.machine = this;
            this.events.emit('change', {
                label: "done", 
                machine: this,
                error: this.error,
            });
            this.events = new events.EventEmitter();

        }else{
            this.stateLabel = name;
            this.events.emit('change', {
                label: this.stateLabel, 
                machine: this,
                error: this.error,
            });
            const getState = this[name.split(' ').join('').toLowerCase()]
            getState(machine);
        }
    }

    this.onStateChange = function(getUpdatedRecords){
        this.events.on('change', function(data){
            getUpdatedRecords({
                label: data.label, 
                mch: data.machine, 
                error: data.error, 
            });
        });
    }

    this.sales = (mch) => {
        try{
            const payload = data.load['1'];
            const result = new Promise(async function(resolve, reject){
                const load = {
                    label: 'sales',
                    currentDate: data.date,
                    sales: payload,
                    outletID: data.outletID
                }

                await APIs.post('/daily-sales/create', load)
                .then(( {data} ) => {
                    if(data.code === 200){
                        resolve("success");
                    }
                }).catch(e => {
                    reject(e)
                });
            });

            result.then(
                (value) => {
                    if(value === "success"){
                        mch.changeState('Return to tank', mch);
                    }
                },
                (error) => {
                    if(error){
                        mch.error = error;
                        mch.events.emit('change', {
                            label: mch.stateLabel, 
                            machine: mch,
                            error: error,
                            state: mch.currentState
                        });
                    }
                }
            );

        }catch(e){
            mch.error = e;
            mch.events.emit('change', {
                label: mch.stateLabel, 
                machine: mch,
                error: mch.error.message,
                state: mch.currentState
            });
        }
    }

    this.returntotank = (mch) => {
        try{
            const payload = data.load['2'];
            const result = new Promise(async function(resolve, reject){
                const load = {
                    label: 'rt',
                    currentDate: data.date,
                    rt: payload,
                    outletID: data.outletID
                }

                await APIs.post('/daily-sales/create', load)
                .then(( {data} ) => {
                    if(data.code === 200){
                        resolve("success");
                    }
                }).catch(e => {
                    reject(e)
                });
            });

            result.then(
                (value) => {
                    if(value === "success"){
                        mch.changeState('esales', mch);
                    }
                },
                (error) => {
                    if(error){
                        mch.error = error;
                        mch.events.emit('change', {
                            label: mch.stateLabel, 
                            machine: mch,
                            error: error,
                            state: mch.currentState
                        });
                    }
                }
            );
            
        }catch(e){
            mch.error = e;
            mch.events.emit('change', {
                label: mch.stateLabel, 
                machine: mch,
                error: mch.error,
                state: mch.currentState
            });
        }
    }

    this.esales = (mch) => {
        try{
            const payload = data.load['3'];
            const result = new Promise(async function(resolve, reject){
                const load = {
                    label: 'esales',
                    currentDate: data.date,
                    lpo: payload,
                    outletID: data.outletID
                }

                await APIs.post('/daily-sales/create', load)
                .then(( {data} ) => {
                    if(data.code === 200){
                        resolve("success");
                    }
                }).catch(e => {
                    reject(e)
                });
            });

            result.then(
                (value) => {
                    if(value === "success"){
                        mch.changeState('Expenses', mch);
                    }
                },
                (error) => {
                    if(error){
                        mch.error = error;
                        mch.events.emit('change', {
                            label: mch.stateLabel, 
                            machine: mch,
                            error: error,
                            state: mch.currentState
                        });
                    }
                }
            );

        }catch(e){
            mch.error = e;
            mch.events.emit('change', {
                label: mch.stateLabel, 
                machine: mch,
                error: mch.error.message,
                state: mch.currentState
            });
        }
    }

    this.expenses = (mch) => {
        try{
            const payload = data.load['4'];
            const result = new Promise(async function(resolve, reject){
                const load = {
                    label: 'expenses',
                    currentDate: data.date,
                    expenses: payload,
                    outletID: data.outletID
                }

                await APIs.post('/daily-sales/create', load)
                .then(( {data} ) => {
                    if(data.code === 200){
                        resolve("success");
                    }
                }).catch(e => {
                    reject(e)
                });
            });

            result.then(
                (value) => {
                    if(value === "success"){
                        mch.changeState('Payments', mch);
                    }
                },
                (error) => {
                    if(error){
                        mch.error = error;
                        mch.events.emit('change', {
                            label: mch.stateLabel, 
                            machine: mch,
                            error: error,
                            state: mch.currentState
                        });
                    }
                }
            );

        }catch(e){
            mch.error = e;
            mch.events.emit('change', {
                label: mch.stateLabel, 
                machine: mch,
                error: mch.error,
                state: mch.currentState
            });
        }
    }

    this.payments = (mch) => {
        try{
            const payload = data.load['5'];
            const result = new Promise(async function(resolve, reject){
                const load = {
                    label: 'payments',
                    currentDate: data.date,
                    payments: payload,
                    outletID: data.outletID
                }

                await APIs.post('/daily-sales/create', load)
                .then(( {data} ) => {
                    if(data.code === 200){
                        resolve("success");
                    }
                }).catch(e => {
                    reject(e)
                });
            });

            result.then(
                (value) => {
                    if(value === "success"){
                        mch.changeState('Dipping', mch);
                    }
                },
                (error) => {
                    if(error){
                        mch.error = error;
                        mch.events.emit('change', {
                            label: mch.stateLabel, 
                            machine: mch,
                            error: error,
                            state: mch.currentState
                        });
                    }
                }
            );
            
        }catch(e){
            mch.error = e;
            mch.events.emit('change', {
                label: mch.stateLabel, 
                machine: mch,
                error: mch.error,
                state: mch.currentState
            });
        }
    }

    this.dipping = (mch) => {
        try{
            const payload = data.load['6'];
            const result = new Promise(async function(resolve, reject){
                const load = {
                    label: 'dipping',
                    currentDate: data.date,
                    dipping: payload,
                    outletID: data.outletID
                }

                await APIs.post('/daily-sales/create', load)
                .then(( {data} ) => {
                    if(data.code === 200){
                        resolve("success");
                    }
                }).catch(e => {
                    reject(e)
                });
            });

            result.then(
                (value) => {
                    if(value === "success"){
                        mch.changeState('Balance Carried Forward', mch);
                    }
                },
                (error) => {
                    if(error){
                        mch.error = error;
                        mch.events.emit('change', {
                            label: mch.stateLabel, 
                            machine: mch,
                            error: error,
                            state: mch.currentState
                        });
                    }
                }
            );
            
        }catch(e){
            mch.error = e;
            mch.events.emit('change', {
                label: mch.stateLabel, 
                machine: mch,
                error: mch.error,
                state: mch.currentState
            });
        }
    }

    this.balancecarriedforward = (mch) => {
        try{
            const payload = data.load['1'];
            const result = new Promise(async function(resolve, reject){
                const load = {
                    label: 'balanceCF',
                    currentDate: data.date,
                    balanceCF: payload,
                    outletID: data.outletID
                }

                await APIs.post('/daily-sales/create', load)
                .then(( {data} ) => {
                    if(data.code === 200){
                        resolve("success");
                    }
                }).catch(e => {
                    reject(e)
                });
            });

            result.then(
                (value) => {
                    if(value === "success"){
                        mch.changeState('done', mch);
                    }
                },
                (error) => {
                    if(error){
                        mch.error = error;
                        mch.events.emit('change', {
                            label: mch.stateLabel, 
                            machine: mch,
                            error: error,
                            state: mch.currentState
                        });
                    }
                }
            );

        }catch(e){
            mch.error = e;
            mch.events.emit('change', {
                label: mch.stateLabel, 
                machine: mch,
                error: mch.error,
                state: mch.currentState
            });
        }
    }

    this.tanklevels = (mch) => {
        try{
            setTimeout(()=>{
                mch.changeState('done', mch);
            }, 1000);
        }catch(e){
            mch.error = e;
            mch.events.emit('change', {
                label: mch.stateLabel, 
                machine: mch,
                error: mch.error,
                state: mch.currentState
            });
        }
    }
}

export default SalesMachine;

//Buffer.from(data, 'base64').toString('ascii'); to decode
//Buffer.from(JSON.stringify(mch)).toString('base64') to encode

//jc.decycle(a)
//jc.retrocycle(JSON.parse(s));