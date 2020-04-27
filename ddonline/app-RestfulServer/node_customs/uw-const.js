const Const = {
    CHANNEL_TYPES: {
        NONE: 0,
        GOOGLE_PLAY: 1,
        GAME_CENTER: 2
    },
    PLATFORM_TYPES:{
        NONE        : 0,
        ANDROID     : 1,
        IOS         : 2,
        WINDOWS     : 3
    },
    FAIL_TYPES: {
        INTERNET_NOT_CONNECTION: 100,
        EXPIRED_SESSION : 101,
        CLIENT_UPDATE : 102,
        CSV_UPDATE : 103,
        USER_HACKING : 104,
        WRONG_SESSION_ID: 105,
        NOT_EXISTS_SESSION_ID: 106
    },
    VERSION_CHECK : {
        CLIENT_UPDATE : 1001,
        CSV_UPDATE : 1002,
        CLIENT_REBOOT : 1003
    },
    REWARD_TYPES: {
        GOODS: 1,
        SKILL: 2,
        MATERIAL: 3,
        EQUIP: 4,
        GACHA: 5
    },
    GOODS_DETAIL: {
        GOLD: 1,
        RUBY: 2
    },
    ITEM_TYPE : {
      MATERIAL: 1,
      EQUIP : 2
    },
    API : {
        REGIST: {
            ALREADY_REGIST: 2000,
            NAME_TOO_LONG: 2002,
            NAME_WRONG_CHAR: 2003,
            ALREADY_NAME: 2001,
            NAME_DUPLICATE: 2004
        },
        LOGIN: {
            ALREADY_LOGIN: 3000,
            BAN_USER: 3001,
            NOT_EXIST_USER : 3002
        },
        EQUIP: {
            SAME_ITEM: 4001,
            NOT_SAME_ITEM : 4002,
            NOT_RIGHT_EQUIPMENTS_TYPE : 4003,
            NOT_EXIST_ITEM : 4004,
            NOT_RIGHT_STATE_TYPE : 4005
        },
        SELL: {
            NOT_EXISTS_ITEM : 5001,
            NOT_ENOUGH_ITEM_CNT : 5002,
            NOT_RIGHT_ITEM_TYPE : 5003,
            NOT_RIGHT_ITEM_CNT : 5004
        },
        LOBBY:{
            NOT_EXISTS_CHARACTER : 3003,
            ALREADY_MAIN_CHARACTER : 3004
        },
        // ych 0427
        BOARD:{
            INVALID_PAGE : 6001,
            NOT_ENOUGH_COST : 6002
        }
        //
    }
};

module.exports = Const;