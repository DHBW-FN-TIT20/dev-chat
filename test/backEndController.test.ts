import { BackEndController } from '../controller/backEndController';

const controller = new BackEndController();
const validUserToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaGFubmVzIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTY0NjMwNzQxNywiZXhwIjoxNjQ2MzkzODE3fQ.CUHeOP_Mei82UKjp14_MvujUibt6oFepSQtdM4KaroU";
const invalidUserToken = "eyJhbGciOiJIdsfafsUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaGFubmVzIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTY0NjMwNzQxNywiZXhwIjoxNjQ2MzkzODE3fQ.CUHeOP_Mei82UKjp14_MvujUibt6oFepSQtdM4KaroU";

describe('The BackEndController should work as expected', () => {
  
  it('BackEndController.constructor()', () => {
    expect(controller).toBeDefined();
  });

  it('BackEndController.isUserTokenValid()', async () => {    
    expect(await controller.isUserTokenValid(validUserToken)).toBe(true);
    expect(await controller.isUserTokenValid(invalidUserToken)).toBe(false);
  });

  it('BackEndController.getUserIdFromToken()', async () => {
    expect(await controller.getUserIDFromToken(validUserToken)).toBe(40);
  });

  // TODO: Add more tests ( at leat check 10 methods )

  

});
