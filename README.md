# scopetracking-network

> This network allows for a contract to be established between a Contractor and Employer which details payment terms and for this contract to be associated with a scope of work. It then facilitates the tracking of completion of stages of the work and for the associated payment as per the terms of the contract.


This business network defines:

**Participants**
`Contractor` `Agent` `Employer`

**Assets**
`Work` `Contract` `Account`

**Transactions**
`CompleteWork` `ReleasePayment` `SetupDemo`

**Events**
`CompleteWorkEvent` `ReleasePaymentEvent`

A `Contractor` and `Employer` would agree a `Contract` for the `Contractor` to undertake a particular scope of `Work`. The `Contractor` would then commence work and once completed the first stage of the agreed `Work` would submit a `CompleteWork` transaction. The `Agent` on behalf of the `Employer` would physically inspect the `Work` and if completed would issue a `ReleasePayment` transaction. This then updates the `Account` of all three participants in accordance with the terms in the `Contract`.

To test this Business Network Definition in the **Test** tab:

  

o Submit a `SetupDemo` transaction which executes the following steps:


	o Create `Agent` participant with personId of AGENT_1.

	o Create `Contractor` participant with personId of CONTRACTOR_1.

	o Create `Employer` participant with personId of EMPLOYER_1.

	o Create `Account` asset with accountId of AGENT1_ACC, amount of 0 and owner of AGENT_1

	o Create `Account` asset with accountId of CONTRACTOR1_ACC, amount of 0 and owner of CONTRACTOR_1

	o Create `Account` asset with accountId of EMPLOYER1_ACC, amount of 1000 and owner of EMPLOYER_1

	o Create `Contract` asset with contractId of CONTRACT_1, stagePayment of 100, 
    retention of 0.05 (i.e. 5%), deductions of 0 lossExpenses of 0.

	o Create `Work` asset with workId of FOUNDATIONS and contract of CONTRACT_1

o Submit a `CompleteWork` transaction with work as FOUNDATIONS. Note that the stageComplete for `Work` asset with workId of FOUNDATIONS has changed to true

o Submit a `ReleasePayment` transaction with work of FOUNDATIONS, contractorAccount of CONTRACTOR1_ACC, employerAccount of EMPLOYER1_ACC, retentionAccount of AGENT1_ACC and contract of CONTRACT_1. Note that the 3 `Account` assets created above have been updated in accordance with the stagePayment, retention, deductions and lossExpenses values within the associated `Contract` asset. Also note that the associated `Work` asset (i.e. FOUNDATIONS) stage has incremented to 2 and stageComplete has changed to false

o Additionally you can create new ID's in the ID Registry to test the permissions.acl. Currently restrictiona has been set to only allow a `Contractor` participant to submit a `CompleteWork` transaction and an `Agent` participant to submit a `ReleasePayment` transaction.

Congratulations you have completed the Demo!!

**Future proposed improvements:**

o Update `ReleasePayment` transaction so the `Contract` asset releases the total retention amounts from all stages on completion of the final stage

o Update `ReleasePayment` transaction so that you do not need to enter the contract (this should always be read from the contract that is linked to the `Work` asset)

o Add functionality to the `CompleteWorkEvent` event so that when triggered a notification (email?) is issued to the `Agent` participant to notify them to inspect the work

o Add functionality to the `ReleasePaymentEvent` event so that when triggered a notification (email?) is issued to the `Employer` and `Contractor` participants to notify them of release of payment for completion of the stage of work.

o Implement the stageType enum within the business logic.

## Licence

Copyright [2019] [Blocks and Mortar Ltd]

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

 ## History  
   
   This network was orginally selected as winner of the Smart Procurement Toolkit for the AEC Industry Construction Blockchain Consortium Hackathon 2019 (https://www.constructionblockchain.org/20190207-hackathon/). It has subsequently been further developed to improve functionality.