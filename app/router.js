module.exports = app => {
    require('./router/orderRouter')(app);
    require('./router/userRouter')(app);
    require('./router/dingdingRouter')(app);
};
