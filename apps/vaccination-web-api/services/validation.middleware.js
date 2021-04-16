
'use strict';

exports.verifyRefreshBodyField = (wallet) => {
    var userExists = await wallet.exists(user);
    if (!userExists) {
        return res.status(400).send({error: 'need to pass refresh_token field'});
    }
    return;
};

