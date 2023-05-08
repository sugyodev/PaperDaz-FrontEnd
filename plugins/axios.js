export default function ({$axios , redirect}){
    $axios.onRequest(config=>{
       // const token = localStorage.getItem('auth._token.local')
            // if(token) {
            //     config.headers.Authorization = `Bearer ${token}`;
            //     return config;
            // } else {
            //     return config;
            // }
    })

    $axios.onError(error=>{
        const code = parseInt(error.response && error.response.status)
          if(code >= 500){
            //   redirect("/")
          }
    })
}