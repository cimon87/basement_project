export class Credentials
{
    public static MySQLEventsCredentials : any = {
        host:     "localhost",
        user:     "zongji",
        password: ""
    }

    public static MySQLCredentials : any = {
        host:     Credentials.MySQLEventsCredentials.host,
        user:     Credentials.MySQLEventsCredentials.user,
        password: Credentials.MySQLEventsCredentials.password,
        database: "gammu" 
    }
}