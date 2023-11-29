



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
            type:DataTypes.TEXT,
            validate:{
                len:{
                    args:[0,1000],
                    msg:"Message length should be less than 1000 characters"
                },
            }
        },
        imageURL:{
            type:DataTypes.STRING,
            allowNull:true
        }
    },{
        freezeTableName:true,
        validate:{
            eitherMessageOrImageURL(){
                if (!this.message && !this.imageURL) {
                    throw new Error('Either message or imageURL must be present');
                }  
            }
        }
    })
}


function agentChatListModel (sequelize,DataTypes){
    return AgentChatListModel =sequelize.define('chat_agent_list',{
        user_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            unique:true,
            references:{
                model:'user_userAccount',
                key:'user_id'
            },
            onDelete:'CASCADE',
        }
    },{
        freezeTableName:true
    })
}


module.exports = {agentChatModel,agentChatListModel}

