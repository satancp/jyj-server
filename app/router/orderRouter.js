module.exports = app => {
    const { router, controller } = app;
    router.get('/api/order/get_all_orders', controller.order.orderController.getAllOrders);
    router.post('/api/order/add_order', controller.order.orderController.addOrder);
    router.post('/api/order/send_order', controller.order.orderController.sendOrder);
    router.post('/api/order/update_order', controller.order.orderController.updateOrder);
    router.post('/api/order/update_user_order', controller.order.orderController.updateUserOrder);
    router.post('/api/order/confirm_accept_order', controller.order.orderController.confirmAcceptOrder);
    router.post('/api/order/upload', controller.order.orderController.upload);
};
