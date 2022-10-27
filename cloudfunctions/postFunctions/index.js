const createPost = require('./createPost/index');
const getPostList = require('./getPostList/index');
const getPostDetail = require('./getPostDetail/index');
const editPost = require('./editPost/index');
const searchPost = require('./searchPost/index');
const likePost = require('./likePost/index');
const cancelLike = require('./cancelLike/index');
const isLike = require('./isLike/index');
const collectPost = require('./collectPost/index');
const cancelCollect = require('./cancelCollect/index');
const isCollect = require('./isCollect/index');
const getCollectList = require('./getCollectList/index');
const getPostListByCat = require('./getPostListByCat/index')
const getPostListByUser = require('./getPostListByUser/index')
const deletePost = require('./deletePost/index')

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    switch(event.type){
        case 'createPost':
            return await createPost.main(event, context);
        case 'getPostList':
            return await getPostList.main(event, context);
        case 'getPostDetail':
            return await getPostDetail.main(event, context);
        case 'editPost':
            return await editPost.main(event, context);
        case 'searchPost':
            return await searchPost.main(event, context);
        case 'likePost':
            return await likePost.main(event, context);
        case 'cancelLike':
            return await cancelLike.main(event, context);
        case 'isLike':
            return await isLike.main(event, context);
        case 'collectPost':
            return await collectPost.main(event,context);
        case 'cancelCollect':
            return await cancelCollect.main(event, context);
        case 'isCollect':
            return await isCollect.main(event, context);
        case 'getCollectList':
            return await getCollectList.main(event, context);
        case 'getPostListByCat':
            return await getPostListByCat.main(event, context);
        case 'getPostListByUser':
            return await getPostListByUser.main(event,context);
        case 'deletePost':
            return await deletePost.main(event,context);
    }
}