
function customerChatModel(sequelize,DataTypes){
    return CustomerChatModel = sequelize.define('chat_customer',{
        
        sender_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        receiver_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        message:{
            type:DataTypes.STRING,
            allowNull:true
        },
        // imageLink:{
        //     type:DataTypes.STRING,
        //     allowNull:true
        // }

    },{
        freezeTableName:true
    })
}

function customerChatListModel (sequelize,DataTypes){
    return CustomerChatList = sequelize.define('chat_customer_list',{
        user_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            unique:true,
            references:{
                model:'user_userAccount',
                key:'user_id'
            }
        }

    },{
        freezeTableName:true
    })
}


module.exports = {customerChatModel,customerChatListModel}



const { pool } = require("../../connection");


async function getSingleCustomerChat(id){

    const sqlQuery = `SELECT id,sender_id,receiver_id,message,timestamp FROM ${chatTable.customer} WHERE sender_id = ? OR receiver_id = ? `;

    try {
        const [result,field] = await pool.query(sqlQuery,[id,id]);
        return result;
    } catch (error) {
        throw error;
    }

}


async function insertCustomerChat(sender_id,receiver_id,message){
    
        const insertQuery = `INSERT INTO ${chatTable.customer} (sender_id,receiver_id,message) VALUES (?,?,?)`;

        try {
            const [response,field] = await pool.query(insertQuery,[sender_id,receiver_id,message]);
            return response;
        } catch (error) {
            throw error;
        }
}

async function insertCustomerList(customer_id){
    const insertQuery = `INSERT INTO ${chatTable.customer_list} (customer_id) VALUES(?)`;

    try {
        const [response,field]  = await pool.query(insertQuery,[customer_id]);
        return response;
    } catch (error) {
        throw error;
    }
}


async function getCustomerChatList(){
        
        const sqlQuery = `SELECT * FROM ${chatTable.customer_list}`;

        try {
            const [response,field] = await pool.query(sqlQuery);
            return response;
        } catch (error) {
            throw error;
        }
}






//module.exports = {getSingleCustomerChat,insertCustomerChat,insertCustomerList,getCustomerChatList}