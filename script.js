 var currentUser = null;
 var buySym = '', buyName = '', buyPrice = 0;

 var coins = [
      {rank:1,name:'Bitcoin',sym:'BTC',icon:'₿',color:'#f7931a',price:67842.30,chg:3.24,mcap:'$1.34T',trend:[60,65,58,72,68,80,75]},
      {rank:2,name:'Ethereum',sym:'ETH',icon:'Ξ',color:'#627eea',price:3842.10,chg:5.12,mcap:'$461B',trend:[40,50,45,60,55,70,65]},
      {rank:3,name:'Solana',sym:'SOL',icon:'◎',color:'#9945ff',price:182.40,chg:-1.40,mcap:'$84B',trend:[70,60,65,55,60,50,52]},
      {rank:4,name:'BNB',sym:'BNB',icon:'B',color:'#f0b90b',price:582.20,chg:2.10,mcap:'$85B',trend:[50,55,52,58,60,65,62]},
      {rank:5,name:'XRP',sym:'XRP',icon:'X',color:'#00aae4',price:0.628,chg:-0.80,mcap:'$35B',trend:[55,52,58,50,48,52,50]},
      {rank:6,name:'USDC',sym:'USDC',icon:'$',color:'#2775ca',price:1.00,chg:0.01,mcap:'$28B',trend:[50,50,50,50,50,50,50]},
      {rank:7,name:'Cardano',sym:'ADA',icon:'A',color:'#0033ad',price:0.484,chg:1.20,mcap:'$17B',trend:[45,48,50,55,52,58,56]},
      {rank:8,name:'Chainex',sym:'CHX',icon:'H',color:'#00e676',price:12.84,chg:8.70,mcap:'$4.2B',trend:[30,40,45,55,60,75,80]}
    ];

    function navigate(page) {
      document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active')});
      var el = document.getElementById('page-' + page);
      if(el) el.classList.add('active');
      document.querySelectorAll('.nav-links li a').forEach(function(a){
        a.classList.toggle('active', a.dataset.page === page);
      });
      window.scrollTo(0,0);
      if(page==='prices') renderPrices('');
      if(page==='dashboard') renderDashChart();
    }

    var toastTimer;
    function showToast(msg, icon) {
      var t = document.getElementById('toast');
      document.getElementById('toastMsg').textContent = msg;
      document.getElementById('toastIcon').textContent = icon || '✅';
      t.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function(){t.classList.remove('show')}, 3200);
    }

    