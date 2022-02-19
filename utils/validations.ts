

export const isValidEmail = (email: string): boolean => {
  
    const match = String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
  
      return !!match;
  };
  
  export const isEmail = (email: string): string | undefined => {
    return isValidEmail(email) 
      ? undefined
      : 'El correo no parece ser válido';
  }
  
  