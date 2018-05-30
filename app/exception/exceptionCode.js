const SYSTEM_ERROR = {
    code: 1,
    msg: '内部服务器错误',
};
const DUPLICATE_ORDER_ERROR = {
    code: 2,
    msg: '订单的定制类别已经存在',
};
const USER_ORDER_OVERFLOW_ERROR = {
    code: 3,
    msg: '该用户同时接单数量已经达到最大限制',
};
const ORDER_HAS_BEEN_SENT_ERROR = {
    code: 4,
    msg: '该订单已经被接收',
};
const USER_NOT_EXIST_ERROR = {
    code: 5,
    msg: '该用户不存在',
};

module.exports = {
    SYSTEM_ERROR,
    DUPLICATE_ORDER_ERROR,
    USER_ORDER_OVERFLOW_ERROR,
    ORDER_HAS_BEEN_SENT_ERROR,
    USER_NOT_EXIST_ERROR,
};
