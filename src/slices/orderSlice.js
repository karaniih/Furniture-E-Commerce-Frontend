import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import axios from "../api/axios";

const initialState = {
    placeOrder: {
        order: {},
        error: null,
        loading: false
    },
    getOrders: {
        orders: [],
        error: null,
        loading: false
    },
    changeStatus: {
        error: null,
        loadingIDs: []
    },
    getMyOrders: {
        orders: [],
        error: null,
        loading: false
    },
    dailyOrdersCount: {
        data: [],
        error: null,
        loading: false
    },
    orderStatusCount: {
        data: [],
        error: null,
        loading: false
    },
    currentMonthOrdersCount: {
        data: {},
        error: null,
        loading: false
    },
    makePayment: {
        sessionID: {},
        error: null,
        loading: false
    },
    confirmPayment: {
        error: null,
        loading: false
    },
    mailInvoice: {
        loadingIDs: [],
        error: null,
    }
}

export const placeOrder = createAsyncThunk(
    "orders/placeOrder",
    async(data, thunkApi) => {
        try {
            const response = await axios.post("/orders/create", data)
            return response.data
        } catch (error) {
            const message = error.response.data.message
            return thunkApi.rejectWithValue(message)
        }
    }
)

export const getOrders = createAsyncThunk(
    "orders/getOrders",
    async(_, thunkApi) => {
        try {
            const response = await axios.get("/orders/get")
            return response.data
        } catch (error) {
            const message = error.response.data.message
            return thunkApi.rejectWithValue(message)
        }
    }
)

export const changeOrderStatus = createAsyncThunk(
    "orders/changeOrderStatus",
    async(data, thunkApi) => {
        try {
            const response = await axios.put("/orders/changeStatus", data)
            return response.data
        } catch (error) {
            const message = error.response.data.message
            return thunkApi.rejectWithValue(message)
        }
    }
)

export const getMyOrders = createAsyncThunk(
    "orders/getMyOrders",
    async(_, thunkApi) => {
        try {
            const response = await axios.get("/orders/getMyOrders")
            return response.data
        } catch (error) {
            const message = error.response.data.message
            return thunkApi.rejectWithValue(message)
        }
    }
)

export const dailyOrdersCount = createAsyncThunk(
    "orders/dailyOrdersCount",
    async(_, thunkApi) => {
        try {
            const response = await axios.get("/orders/getDailyOrdersCount")
            return response.data
        } catch (error) {
            const message = error.response.data.message
            return thunkApi.rejectWithValue(message)
        }
    }
)

export const orderStatusCount = createAsyncThunk(
    "orders/orderStatusCount",
    async(time, thunkApi) => {
        try {
            const response = await axios.get(`/orders/getOrderStatusCount/${time}`)
            return response.data
        } catch (error) {
            const message = error.response.data.message
            return thunkApi.rejectWithValue(message)
        }
    }
)

export const currentMonthOrdersCount = createAsyncThunk(
    "orders/currentMonthOrdersCount",
    async(_, thunkApi) => {
        try {
            const response = await axios.get("/orders/getThisMonthOrdersCount")
            return response.data
        } catch (error) {
            const message = error.response.data.message
            return thunkApi.rejectWithValue(message)
        }
    }
)

export const searchOrders = createAsyncThunk(
    "orders/searchOrders",
    async(query, thunkApi) => {
        try {
            const response = await axios.get(`/orders/search/${query}`)
            return response.data
        } catch (error) {
            const message = error.response.data.message
            return thunkApi.rejectWithValue(message)
        }
    }
)

export const filterOrders = createAsyncThunk(
    "orders/filterOrders",
    async(status, thunkApi) => {
        try {
            const response = await axios.get(`/orders/filter/${status}`)
            return response.data
        } catch (error) {
            const message = error.response.data.message
            return thunkApi.rejectWithValue(message)
        }
    }
)

export const makePayment = createAsyncThunk(
    "payment/makePayment",
    async(data, thunkApi) => {
        try {
            const response = await axios.post('/payment/checkout-session', data)
            return response.data
        } catch (error) {
            const message = error.response.data.message
            return thunkApi.rejectWithValue(message)
        }
    }
)

export const confirmPayment = createAsyncThunk(
    "payment/confirmPayment",
    async(sessionID, thunkApi) => {
        try {
            const response = await axios.get(`/orders/confirm/${sessionID}`)
            return response.data
        } catch (error) {
            const message = error.response.data.message
            return thunkApi.rejectWithValue(message)
        }
    }
)

export const mailInvoice = createAsyncThunk(
    "orders/mailInvoice",
    async(id, thunkApi) => {
        try {
            const response = await axios.get(`/orders/mailInvoice/${id}`)
            return response.data
        } catch (error) {
            const message = error.response.data.message
            return thunkApi.rejectWithValue(message)           
        }
    }
)

export const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        //PLACE ORDER
        .addCase(placeOrder.pending, (state) => {
            state.placeOrder.loading = true
        })
        .addCase(placeOrder.fulfilled, (state) => {
            state.placeOrder.loading = false
        })
        .addCase(placeOrder.rejected, (state, action) => {
            state.placeOrder.loading = false
            state.placeOrder.error = action.payload
        })

        //GET ORDERS
        .addCase(getOrders.pending, (state) => {
            state.getOrders.loading = true
        })
        .addCase(getOrders.fulfilled, (state, action) => {
            state.getOrders.loading = false
            state.getOrders.orders = action.payload.orders
        })
        .addCase(getOrders.rejected, (state, action) => {
            state.getOrders.loading = false
            state.getOrders.error = action.payload
        })

        //CHANGE STATUS
        .addCase(changeOrderStatus.pending, (state, action) => {
            state.changeStatus.loadingIDs.push(action.meta.arg.id)
        })
        .addCase(changeOrderStatus.fulfilled, (state, action) => {
            state.getOrders.orders.map((order) => {
                if(order._id === action.payload.order._id){
                    order.orderStatus = action.payload.order.orderStatus
                    order.paymentStatus = action.payload.order.paymentStatus
                }
            })
            state.changeStatus.loadingIDs = state.changeStatus.loadingIDs.filter((i) => i._id === action.payload.order._id)
        })
        .addCase(changeOrderStatus.rejected, (state, action) => {
            state.changeStatus.loadingIDs = []
            state.changeStatus.error = action.payload
        })

        //GET MY ORDERS
        .addCase(getMyOrders.pending, (state) => {
            state.getMyOrders.loading = true
        })
        .addCase(getMyOrders.fulfilled, (state, action) => {
            state.getMyOrders.loading = false
            state.getMyOrders.orders = action.payload.orders
        })
        .addCase(getMyOrders.rejected, (state, action) => {
            state.getMyOrders.loading = false
            state.getMyOrders.error = action.payload
        })

        //GET DAILY ORDERS COUNT
        .addCase(dailyOrdersCount.pending, (state) => {
            state.dailyOrdersCount.loading = true
        })
        .addCase(dailyOrdersCount.fulfilled, (state, action) => {
            state.dailyOrdersCount.loading = false
            state.dailyOrdersCount.data = action.payload.orders
        })
        .addCase(dailyOrdersCount.rejected, (state, action) => {
            state.dailyOrdersCount.loading = false
            state.dailyOrdersCount.error = action.payload
        })

        //GET ORDER STATUS COUNT
        .addCase(orderStatusCount.pending, (state) => {
            state.orderStatusCount.loading = true
        })
        .addCase(orderStatusCount.fulfilled, (state, action) => {
            state.orderStatusCount.loading = false
            state.orderStatusCount.data = action.payload.orders
            console.log(action.payload.orders)
        })
        .addCase(orderStatusCount.rejected, (state) => {
            state.orderStatusCount.loading = false
            state.orderStatusCount.error = action.payload
        })

        //GET CURRENT MONTH ORDERS COUNT
        .addCase(currentMonthOrdersCount.pending, (state) => {
            state.currentMonthOrdersCount.loading = true
        })
        .addCase(currentMonthOrdersCount.fulfilled, (state, action) => {
            state.currentMonthOrdersCount.loading = false
            state.currentMonthOrdersCount.data = action.payload
        })
        .addCase(currentMonthOrdersCount.rejected, (state, action) => {
            state.currentMonthOrdersCount.loading = false
            state.currentMonthOrdersCount.error = action.payload
        })

        //SEARCH ORDERS
        .addCase(searchOrders.pending, (state) => {
            state.getOrders.loading = true
        })
        .addCase(searchOrders.fulfilled, (state, action) => {
            if(action.payload.length === 0)
                state.getOrders.orders = []
            console.log(action.payload)
            state.getOrders.orders = action.payload
            state.getOrders.loading = false
        })
        .addCase(searchOrders.rejected, (state, action) => {
            state.getOrders.loading = false
            state.getOrders.error = action.payload
        })

        //FILTER ORDERS
        .addCase(filterOrders.pending, (state) => {
            state.getOrders.loading = true
        })
        .addCase(filterOrders.fulfilled, (state, action) => {
            state.getOrders.loading = false
            state.getOrders.orders = action.payload
        })
        .addCase(filterOrders.rejected, (state, action) => {
            state.getOrders.loading = false
            state.getOrders.error = action.payload
        })

        //MAKE PAYMENT
        .addCase(makePayment.pending, (state) => {
            state.placeOrder.loading = true
        })
        .addCase(makePayment.fulfilled, (state, action) => {
            state.placeOrder.loading = false
            state.makePayment.data = action.payload
            state.makePayment.sessionID = action.payload.id
        })
        .addCase(makePayment.rejected, (state, action) => {
            state.placeOrder.loading = false
            state.placeOrder.error = action.payload
        })

        //CONFIRM PAYMENT
        .addCase(confirmPayment.pending, (state) => {
            state.confirmPayment.loading = true
        })
        .addCase(confirmPayment.fulfilled, (state) => {
            state.confirmPayment.loading = false
        })
        .addCase(confirmPayment.rejected, (state, action) => {
            state.confirmPayment.loading = false
            state.confirmPayment.error = action.payload
        })

        //MAIL INVOICE
        .addCase(mailInvoice.pending, (state, action) => {
            state.mailInvoice.loadingIDs.push(action.meta.arg)
        })
        .addCase(mailInvoice.fulfilled, (state, action) => {
            state.mailInvoice.loadingIDs = state.mailInvoice.loadingIDs.filter((id) => { action.payload.order_id === id })
        })
        .addCase(mailInvoice.rejected, (state, action) => {
            state.mailInvoice.error = action.payload
            state.mailInvoice.loadingIDs = []
        })
    }
})


export default orderSlice.reducer