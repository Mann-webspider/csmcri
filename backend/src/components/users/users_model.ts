export type UserLoginData = {

  user_id: string,
  email: string,
  hashed_password: string,
  profile?:Profile | null,
  jwt_token: string,
  reset_token: string,
  isDelete: boolean,
  updated_at: Date,
  created_at: Date

}

export type Profile = {
  profile_id: string,
  user_id: string,
  user_cred?:UserLoginData
  firstname: string,
  lastname: string,
  phone: string,
  dob: any,
  email: string,
  gender: string,
  isDelete: boolean

}

