/**
 * 新建的路由器可以直接配置对数据库的增删查改路由:
 *      findAll, find, insert, update, remove
 */

const express = require('express');
let _ = require('lodash');

module.exports = (router, db, defaultRoutes) => {
    if (db) {
        if (_.indexOf(defaultRoutes, 'findAll') !== -1) {
            router
                .route('/')
                .get((req, res, next) => {
                    if (req.query.pageSize === undefined) {
                        req.query.pageSize = 25;
                    }
                    else {
                        req.query.pageSize = parseInt(req.query.pageSize);
                    }
                    if (req.query.pageNum === undefined) {
                        req.query.pageNum = 1;
                    }
                    else {
                        req.query.pageNum = parseInt(req.query.pageNum);
                    }

                    db
                        .findByPage({}, {
                            pageSize: req.query.pageSize,
                            pageNum: req.query.pageNum
                        })
                        .then(docs => {
                            res.locals.resData = docs;
                            res.locals.template = {};
                            res.locals.succeed = true;
                            return next();
                        })
                        .catch(next);
                });
        }
        if (_.indexOf(defaultRoutes, 'find') !== -1) {
            router
                .route('/:id')
                .get((req, res, next) => {
                    if (req.params.id) {
                        db
                            .findOne({ _id: req.params.id })
                            .then(doc => {
                                res.locals.resData = doc;
                                res.locals.template = {};
                                res.locals.succeed = true;
                                return next();
                            })
                            .catch(next);
                    } else {
                        return next(new Error('invalid request url!'));
                    }
                });
        }
        if (_.indexOf(defaultRoutes, 'insert') !== -1) {
            router
                .route('/')
                .post((req, res, next) => {
                    if (req.body.doc) {
                        db
                            .insert(req.body.doc)
                            .then(doc => {
                                res.locals.resData = doc;
                                res.locals.template = {};
                                res.locals.succeed = true;
                                return next();
                            })
                            .catch(next);
                    } else {
                        return next(new Error('invalid request body!'));
                    }
                });
        }
        if (_.indexOf(defaultRoutes, 'update') !== -1) {
            router
                .route('/:id')
                .put((req, res, next) => {
                    if (req.body.doc) {
                        db
                            .update({ _id: req.body.id }, req.body.doc)
                            .then((doc) => {
                                // TODO 此doc非彼doc
                                res.locals.resData = doc;
                                res.locals.template = {};
                                res.locals.succeed = true;
                                return next();
                            })
                            .catch(next);
                    } else {
                        return next(new Error('invalid request body!'));
                    }
                });
        }
        if (_.indexOf(defaultRoutes, 'remove') !== -1) {
            router
                .route('/:id')
                .delete((req, res, next) => {
                    db
                        .remove({ _id: req.params.id })
                        .then((doc) => {
                            res.locals.resData = doc;
                            res.locals.template = {};
                            res.locals.succeed = true;
                            return next();
                        })
                        .catch(next);
                });
        }
    }
}

