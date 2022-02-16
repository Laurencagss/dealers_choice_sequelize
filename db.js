const express = require('express');
const { Sequelize, UUID, UUIDV4 } = require('sequelize');
const app = express();
const sequelize = require('sequelize');
const STRING = sequelize.DataTypes.STRING;
const db = new Sequelize(
    process.env.DATABASE_URL || "postgres://localhost/dealers_choice_sequelize");

const Show = db.define("show", {
    id: {
       type: UUID,
       primaryKey: true,
       defaultValue: UUIDV4
        },
        name : {
            type: STRING,
            validate:{
                notEmpty: true,
        }
    }
});


const Song = db.define("song", {
    id: {
       type: UUID,
       primaryKey: true,
       defaultValue: UUIDV4
        },
        name : {
            type: STRING,
            validate:{
                notEmpty: true,
        }
    }
});

const shows = ['Waitress','Fun Home','Chicago', 'Color Purple'];
const songs = ['She Used to Be Mine','Opening Up','Cell Block Tango', 'Changing My Major', 'Im Here','What About Love'];

Show.hasMany(Song);
Song.belongsTo(Show);

const syncAndSeed = async () => {
    await db.sync({force:true});
    const [waitress,funhome, chicago, colorpurple] = await Promise.all(shows.map(name => Show.create({name})));
    const [sutbm,ou,cbt,cmm,ih,wal] = await Promise.all(songs.map(name => Song.create({name})));
    sutbm.showID = waitress.id;
    ou.showID = waitress.id;
    cbt.showID = chicago.id;
    ih.showID = colorpurple.id;
    wal.showID = colorpurple.id;
    cmm.showID = funhome.id;
    await Promise.all([ou.save(),sutbm.save(),cbt.save(),cmm.save(),ih.save(),wal.save()]);
}

module.exports = {
    syncAndSeed,
    models: {
        Show,
        Song
    }
}