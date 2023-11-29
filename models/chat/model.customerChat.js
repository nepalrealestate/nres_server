
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

function customerChatListModel (sequelize,DataTypes){
    return CustomerChatList = sequelize.define('chat_customer_list',{
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


module.exports = {customerChatModel,customerChatListModel}




