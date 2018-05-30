module.exports = app => {
    const { router, controller } = app;
    router.get('/api/user/get_all_users', controller.user.userController.getAllUsers);
    router.get('/api/user/get_user_by_ding_id', controller.user.userController.getUserByDingId);
};
