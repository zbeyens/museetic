//this is the config shared by both server and client
module.exports = {
    //input length
    formNameLength: 20,
    formEmailLength: 254,
    formPasswordLength: 256,

    formChatLength: 200, //chat comment
    formChatRow: 1, //chat comment
    formCommentLength: 200, //art comment
    formCommentRow: 1, //art comment

    nameMuseumLength: 30,
    addressMuseumLength: 1000,
    descMuseumLength: 1000,
    urlMuseumLength: 1000,
    telMuseumLength: 30, //idem for fax
    openMuseumLength: 300,
    closeMuseumLength: 300,
    tarifMuseumLength: 300,

    titleArtLength: 50,
    subtitleArtLength: 50,
    abstractArtLength: 1000,
    descArtLength: 5000,

    nameUserLength: 20,
    genderUserLength: 20,
    bioUserLength: 40,
    locationUserLength: 20,
    professionUserLength: 20,

    defaultPicMuseum: '/client/img/museum-1024.png',
    defaultPicArt: '/client/img/cafe-128.png',
    defaultPicUser: '/client/img/user-image-128.png',
};
