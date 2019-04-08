/*
* Contractor confirms work is complete for the current stage
* @param {org.example.scopetracking.CompleteWork} completeWork
* @transaction
*/

async function onCompleteWork(completeWork) {
    console.log('completeWork');
    const factory = getFactory();
  
    // update Work ledger
    completeWork.work.stageComplete = true;
    
    // commit to the blockchain
    let assetRegistry = await getAssetRegistry('org.example.scopetracking.Work');
    await assetRegistry.update(completeWork.work);
  
    // emit the event which Employer's Agent Subscribes to so they can check work
    const completeWorkEvent = factory.newEvent('org.example.scopetracking', 'CompleteWorkEvent');
      completeWorkEvent.work = completeWork.work;
      emit(completeWorkEvent); 
  }
  /*
  * Employer's agent releases payment which updates stage and approval of Work
  * @param {org.example.scopetracking.ReleasePayment} releasePayment
  * @transaction
  */
  
  async function onReleasePayment(releasePayment) {
    console.log('releasePayment');
    const factory = getFactory();  
    
    // exit if Employer's account is too low
    if (releasePayment.employerAccount.amount < 100) {
          throw new Error('Employer Cannot afford to Pay!!');
    }
    
    // update Work ledger
    releasePayment.work.stage = releasePayment.work.stage + 1;
    releasePayment.work.stageComplete = false; 
    
    // update blockchain with new next work stage
    let assetRegistry = await getAssetRegistry('org.example.scopetracking.Work');
    await assetRegistry.update(releasePayment.work);
     
    // Debit Employer's Account ledger
    releasePayment.employerAccount.amount = releasePayment.employerAccount.amount - releasePayment.contract.stagePayment + (releasePayment.contract.deductions + releasePayment.contract.lossExpenses); 
    
    // Credit Contractor's Account ledger
    releasePayment.contractorAccount.amount = releasePayment.contractorAccount.amount + releasePayment.contract.stagePayment * (1 - releasePayment.contract.retention) - (releasePayment.contract.deductions + releasePayment.contract.lossExpenses);                   
    // Credit Retention Account
    releasePayment.retentionAccount.amount = releasePayment.retentionAccount.amount + releasePayment.contract.stagePayment * releasePayment.contract.retention
    
    // Update blockchain with new Account amounts
    let assetRegistry2 = await getAssetRegistry('org.example.scopetracking.Account');
    await assetRegistry2.update(releasePayment.contractorAccount); 
    await assetRegistry2.update(releasePayment.employerAccount);
    await assetRegistry2.update(releasePayment.retentionAccount);
  
    // emit the event which the Contractor & Employer Subscribes to see Stage is complete & monies released
    const releasePaymentEvent = factory.newEvent('org.example.scopetracking', 'ReleasePaymentEvent');
      releasePaymentEvent.work = releasePayment.work;
      releasePaymentEvent.contract = releasePayment.contract;
      emit(releasePaymentEvent);  
  } 
  /*
  // Credit Retention Account (5% per stage payment) - NOT COMPLETED
  // Can query the Retention Account but unsure how to parse the new value to the amount parameter (so used the standard approach above 
  //  const retentionAccount = await query('selectRetentionAccount')
  //  Var testStatus = 
  //  console.log(retentionAccount)
  //  await retentionAccount.update(releasePayment.amount)
  
  
  //  return getAssetRegistry('org.example.scopetracking.Account').then(function(ar) {
  //      return ar.get(accountID)   // you must get the asset by identifier
  //      }).then(function(asset) {
  //           asset.amount = 100;   
  //           return ar.update(asset);
  //       }); */

 /**
 * Create a New Employer
 * @param {org.example.scopetracking.CreateEmployer} cEmployer 
 * @transaction
 */
function CreateEmployer(cEmployer) {
  console.log(cEmployer)
      return getParticipantRegistry('org.example.scopetracking.Employer')
          .then(function (registry) {
              var factory = getFactory();
              // Create the employer
              var employer = factory.newResource('org.example.scopetracking', 'Employer', cEmployer.newpersonId);
              employer.firstName = cEmployer.newfirstName;
              employer.lastName = cEmployer.newlastName;
              // Add the employer asset to the registry.
              return registry.add(employer);
          });
  }

  /*
  * Create setup demo records (participants & assets)
  * @param {org.example.scopetracking.SetupDemo} setupDemo - SetupDemo instance
  * @transaction
  **/
 async function setupDemo(setupDemo) {  // eslint-disable-line no-unused-vars
   const factory = getFactory();
 
   //Create participants
   const employer = factory.newResource('org.example.scopetracking', 'Employer', 'EMPLOYER_1');
   employer.personId = 'EMPLOYER_1';
   employer.firstName = 'JACKIE';
   employer.lastName = 'JONES';
   const employerRegistry = await getParticipantRegistry('org.example.scopetracking.Employer');
   await employerRegistry.add(employer);

   const contractor = factory.newResource('org.example.scopetracking', 'Contractor', 'CONTRACTOR_1');
   contractor.personId = contractor.getIdentifier();
   contractor.firstName = 'STEPHEN';
   contractor.lastName = 'SMITH';
   const contractorRegistry = await getParticipantRegistry('org.example.scopetracking.Contractor');
   await contractorRegistry.add(contractor);

   const agent = factory.newResource('org.example.scopetracking', 'Agent', 'AGENT_1');
   agent.personId = agent.getIdentifier();
   agent.firstName = 'TANYA';
   agent.lastName = 'TAYLOR';
   const agentRegistry = await getParticipantRegistry('org.example.scopetracking.Agent');
   await agentRegistry.add(agent);   

   //Create assets
   const account1 = factory.newResource('org.example.scopetracking', 'Account', 'EMPLOYER1_ACC');
   account1.accountID = account1.getIdentifier();
   account1.amount = 1000;
   // relationship to Employer Asset
   account1.owner = factory.newResource('org.example.scopetracking', 'Employer', 'EMPLOYER_1')
   const account1Registry = await getAssetRegistry('org.example.scopetracking.Account');
   await account1Registry.add(account1);      

   const account2 = factory.newResource('org.example.scopetracking', 'Account', 'CONTRACTOR1_ACC');
   account2.accountID = account2.getIdentifier();
   account2.amount = 0;
   account2.owner = factory.newResource('org.example.scopetracking', 'Contractor', 'CONTRACTOR_1')
   const account2Registry = await getAssetRegistry('org.example.scopetracking.Account');
   await account2Registry.add(account2);      

   const account3 = factory.newResource('org.example.scopetracking', 'Account', 'AGENT1_ACC');
   account3.accountID = account3.getIdentifier();
   account3.amount = 0;
   account3.owner = factory.newResource('org.example.scopetracking', 'Agent', 'AGENT_1')
   const account3Registry = await getAssetRegistry('org.example.scopetracking.Account');
   await account3Registry.add(account3);      

   const contract = factory.newResource('org.example.scopetracking', 'Contract', 'CONTRACT_1');
   contract.contractId = contract.getIdentifier();
   contract.stagePayment = 100;
   contract.retention = 0.05;
   contract.deductions = 0;
   contract.lossExpenses = 0;
   const contractRegistry = await getAssetRegistry('org.example.scopetracking.Contract');
   await contractRegistry.add(contract);         
   
   const work =factory.newResource('org.example.scopetracking', 'Work', 'FOUNDATIONS');
   work.workId = work.getIdentifier();
   work.description = 'Foundations scope of work';
   work.stage = 1;
   work.stageComplete = false;
   work.contract = factory.newResource('org.example.scopetracking', 'Contract', 'CONTRACT_1')
   const workRegistry = await getAssetRegistry('org.example.scopetracking.Work');
   await workRegistry.add(work);      
     
   /*
   * Example code for creating a series of accounts in an array (working but not used)
   *
   
   const accounts = [
     factory.newResource('org.example.scopetracking', 'Account', 'ACCOUNT_1'),
     factory.newResource('org.example.scopetracking', 'Account', 'ACCOUNT_2')
     factory.newResource('org.example.scopetracking', 'Account', 'ACCOUNT_3'),
     
   ];

   accounts.forEach(function(account) {
      const sbi = 'EMPLOYER_' + account.getIdentifier().split('_')[1];     
     account.accountID = account.getIdentifier();
     account.amount = 1000;
     account.owner = factory.newResource('org.example.scopetracking', 'Employer', sbi)
   })
   const accountRegistry = await getAssetRegistry('org.example.scopetracking.Account');
   await accountRegistry.addAll(accounts);  
   **/

 }