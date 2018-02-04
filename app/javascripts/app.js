// Import the page's CSS. Webpack will know what to do with it.
import '../stylesheets/app.css';

import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';
import voting_artifacts from '../../build/contracts/Voting.json';

const App = (w => 
  ({

    init: () => {
      App.attributesInitializing();
      App.setWeb3Object();
      App.Voting.setProvider(w.web3.currentProvider);
      App.populateCandidates();
    },

    attributesInitializing: () => {
      App.Voting = contract(voting_artifacts);
      App.candidates = {};
      App.tokenPrice = null;
    },

    setWeb3Object: () => {
      if (typeof w.web3 !== 'undefined') {
        w.console.warn('Using web3 detected from external source like Metamask');
        w.web3 = new Web3(w.web3.currentProvider);
      } else {
        w.console.warn('No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as its inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask');
        w.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
      }
    },

    populateCandidates: () => {
      App.Voting.deployed()
            .then(contractInstance => {
              contractInstance.allCandidates
                              .call()
                              .then(candidateArray => {
                                  for(let i = 0, len = candidateArray.length; i < len; i++)
                                    App.candidates[w.web3.toUtf8(candidateArray[i])] = `candidate-${i}`;

                                  App.setupCandidateRows();
                                  App.populateCandidateVotes();
                                  App.populateTokenData();
                              });
          });
    },

    populateCandidateVotes : () => {
      let candidateNames = Object.keys(App.candidates);
      for (var i = 0, len = candidateNames.length; i < len; i++) {
        let name = candidateNames[i];
        App.Voting.deployed()
                  .then(contractInstance => {
                    contractInstance.totalVotesFor
                                    .call(name)
                                    .then(v => {
                                      document.querySelector(`#${App.candidates[name]}`).innerHTML = v.toString();
                                    });
                  });
      }
    },

    setupCandidateRows: () => {
      Object.keys(App.candidates)
            .forEach(candidate => { 
              document.querySelector('#candidate-rows')
                      .insertAdjacentHTML('beforeend', 
                                          `<tr><td>${candidate}</td><td id='${App.candidates[candidate]}'></td></tr>`);
            });
    },

    populateTokenData: () => {
      App.Voting.deployed()
                .then(contractInstance => {
                  contractInstance.totalTokens()
                                  .then(v => document.querySelector('#tokens-total').innerHTML = v.toString());
                  
                  contractInstance.tokensSold
                                  .call()
                                  .then(v => document.querySelector('#tokens-sold').innerHTML = v.toString());
                  
                  contractInstance.tokenPrice()
                                  .then(v => {
                                    App.tokenPrice = parseFloat(w.web3.fromWei(v.toString()));
                                    document.querySelector('#token-cost').innerHTML = `${App.tokenPrice} Ether`;
                                  });

                  w.web3
                    .eth
                    .getBalance(contractInstance.address, 
                                (error, result) => document.querySelector('#contract-balance')
                                                            .innerHTML = w.web3.fromWei(result.toString()) + ' Ether');
                });
    },

    voteForCandidate : () => {
      const candidateName = document.querySelector('#candidate');
      const voteTokens = document.querySelector('#vote-tokens');

      document.querySelector('#msg').innerHTML = 'Vote has been submitted. The vote count will increment as soon as the vote is recorded on the blockchain. Please wait.';
      
      App.Voting.deployed()
                .then(contractInstance => {
                  contractInstance.voteForCandidate(candidateName.value, voteTokens.value, 
                                                    {gas: 140000, from: w.web3.eth.accounts[0]})
                                  .then(() => {
                                    let div_id = App.candidates[candidateName.value];
                                    return contractInstance.totalVotesFor
                                                            .call(candidateName.value)
                                                            .then(v => {
                                                              document.querySelector('#' + div_id).innerHTML = v.toString();
                                                              document.querySelector('#msg').innerHTML = '';

                                                              candidateName.value = '';
                                                              voteTokens.value = '';
                                                            });
                                  });
      });
    },

    buyTokens : () => {
      const tokensToBuy = document.querySelector('#buy').value;
      const price = tokensToBuy * App.tokenPrice;

      document.querySelector('#buy-msg').innerHTML = 'Purchase order has been submitted. Please wait.';
      
      App.Voting.deployed()
                .then(contractInstance =>
                  contractInstance.buy({value: w.web3.toWei(price, 'ether'), from: w.web3.eth.accounts[0]})
                                  .then(() => {
                                          document.querySelector('#buy-msg').innerHTML = '';
                                          w.web3.eth
                                              .getBalance(contractInstance.address, 
                                                          (error, result) => 
                                                            document.querySelector('#contract-balance')
                                                                    .innerHTML = `${w.web3.fromWei(result.toString())} Ether`);
                                  })
                );

      App.populateTokenData();
    },

    lookupVoterInfo : () => {
      const address = document.querySelector('#voter-info').value;

      App.Voting.deployed()
                .then(contractInstance => {
                  contractInstance.voterDetails
                                  .call(address)
                                  .then(v => {
                                    const votesPerCandidate = v[1];
                                    const allCandidates = Object.keys(App.candidates);
                                    
                                    document.querySelector('#tokens-bought').innerHTML = `Total Tokens bought: ${v[0].toString()}`;
                                    document.querySelector('#votes-cast').innerHTML = 'Votes cast per candidate: <br />';

                                    for(let i = 0, len = allCandidates.length; i < len; i++) {
                                      document.querySelector('#votes-cast')
                                              .appendChild('beforeend', `${allCandidates[i]}:  ${votesPerCandidate[i]} <br />`);
                                    }
                                  });
                                });
    }

  })
)(window);

window.App = App;

App.init();
