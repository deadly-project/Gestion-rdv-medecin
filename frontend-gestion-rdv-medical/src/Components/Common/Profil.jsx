export default function Profile({ info }){
    console.log(info)
    return(
        <div>
            username : {info.username} <br />
            Role : {info.role}
        </div>
    )
}