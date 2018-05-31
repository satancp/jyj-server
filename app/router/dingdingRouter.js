module.exports = app => {
    const { router, controller } = app;
    router.get('/api/dingding/get_user_from_ding', controller.dingding.dingdingController.getUserFromDing);
    router.get('/api/dingding/get_auth', controller.dingding.dingdingController.getAuth);
};
