



function agentChatModel(sequelize,DataTypes){
    return AgentChatModel = sequelize.define('chat_agent',{
        sender_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        receiver_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        message:{
            type:DataTypes.STRING
        }
    },{
        freezeTableName:true
    })
}


function agentChatListModel (sequelize,DataTypes){
    return AgentChatListModel =sequelize.define('chat_agent_list',{
        agent_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            unique:true,
            references:{
                model:'user_agent',
                key:'agent_id'
            }
        }
    })
}


module.exports = {agentChatModel,agentChatListModel}









const { pool } = require("../../connection");



async function getSingleAgentChat(id){

    const sqlQuery = `SELECT id,sender_id,receiver_id,message,timestamp FROM ${chatTable.agent} WHERE sender_id = ? OR receiver_id = ? `;

    try {
        const [result,field] = await pool.query(sqlQuery,[id,id]);
        return result;
    } catch (error) {
        throw error;
    }

}


async function insertAgentChat(sender_id,receiver_id,message){
    
        const insertQuery = `INSERT INTO ${chatTable.agent} (sender_id,receiver_id,message) VALUES (?,?,?)`;

        try {
            const [response,field] = await pool.query(insertQuery,[sender_id,receiver_id,message]);
            return response;
        } catch (error) {
            throw error;
        }
}

async function insertAgentList(agent_id){
    const insertQuery = `INSERT INTO ${chatTable.agent_list} (agent_id) VALUES(?)`;

    try {
        const [response,field]  = await pool.query(insertQuery,[agent_id]);
        return response;
    } catch (error) {
        throw error;
    }
}


async function getAgentChatList(){
        
        const sqlQuery = `SELECT * FROM ${chatTable.agent_list}`;

        try {
            const [response,field] = await pool.query(sqlQuery);
            return response;
        } catch (error) {
            throw error;
        }
}


// module.exports ={getSingleAgentChat,insertAgentChat,insertAgentList,getAgentChatList}

