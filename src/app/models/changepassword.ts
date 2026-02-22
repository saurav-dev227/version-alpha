export class changePassword {
    constructor(
        public token: string,
        public oldpassword: string,
        public newpassword: string,
        
    ){}
}