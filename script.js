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

    function heroSignup() {
      var email = document.getElementById('heroEmail').value.trim();
      if(!email){showToast('Please enter your email or phone','⚠️');return;}
      navigate('signup');
      showToast('Continue your signup below!','✉️');
    }

    function doLogin() {
      var email = document.getElementById('loginEmail').value.trim();
      var pass = document.getElementById('loginPass').value;
      if(!email||!pass){showToast('Please fill in all fields','⚠️');return;}
      currentUser = email.split('@')[0] || 'User';
      document.getElementById('dashName').textContent = currentUser;
      showToast('Welcome back, ' + currentUser + '!','🎉');
      navigate('dashboard');
    }

    function doSignup() {
      var name = document.getElementById('signupName').value.trim();
      var email = document.getElementById('signupEmail').value.trim();
      var pass = document.getElementById('signupPass').value;
      var agree = document.getElementById('agreeTerms').checked;
      if(!name||!email||!pass){showToast('Please fill in all fields','⚠️');return;}
      if(!agree){showToast('Please agree to the Terms of Service','⚠️');return;}
      if(pass.length<8){showToast('Password must be at least 8 characters','⚠️');return;}
      currentUser = name.split(' ')[0];
      document.getElementById('dashName').textContent = currentUser;
      showToast('Account created! Welcome, ' + currentUser + '!','🎉');
      navigate('dashboard');
    }

    function sparklineSVG(data, positive) {
      var max=Math.max.apply(null,data), min=Math.min.apply(null,data), w=80, h=30;
      var pts = data.map(function(v,i){
        return (i/(data.length-1))*w + ',' + (h-((v-min)/(max-min||1))*(h-4)+2);
      }).join(' ');
      var col = positive ? '#00e676' : '#ff5252';
      return '<svg width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'"><polyline points="'+pts+'" fill="none" stroke="'+col+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }

    function renderPrices(filter) {
      var filtered = coins.filter(function(c){
        return c.name.toLowerCase().indexOf(filter.toLowerCase())>-1 || c.sym.toLowerCase().indexOf(filter.toLowerCase())>-1;
      });
      var html = filtered.map(function(c){
        return '<tr>' +
          '<td style="color:var(--muted2)">'+c.rank+'</td>' +
          '<td><div class="coin-cell"><div class="coin-icon" style="background:'+c.color+'20;color:'+c.color+'">'+c.icon+'</div><div><div class="coin-name">'+c.name+'</div><div class="coin-sym">'+c.sym+'</div></div></div></td>' +
          '<td style="font-weight:600">$'+c.price.toLocaleString()+'</td>' +
          '<td class="'+(c.chg>=0?'pos':'neg')+'">'+(c.chg>=0?'▲':'▼')+' '+Math.abs(c.chg)+'%</td>' +
          '<td style="color:var(--muted2)">'+c.mcap+'</td>' +
          '<td>'+sparklineSVG(c.trend,c.chg>=0)+'</td>' +
          '<td><button class="buy-btn" onclick="openBuy(\''+c.name+'\',\''+c.sym+'\','+c.price+')">Buy</button></td>' +
          '</tr>';
      }).join('');
      document.getElementById('pricesBody').innerHTML = html;
    }

    function filterCoins() { renderPrices(document.getElementById('coinSearch').value); }

    function openBuy(name, sym, price) {
      buyName = name; buySym = sym; buyPrice = price;
      document.getElementById('buyModalCoin').textContent = name;
      document.getElementById('buyAmount').value = '';
      document.getElementById('buyReceive').textContent = '0 ' + sym;
      document.getElementById('buyModal').classList.add('open');
      document.getElementById('buyAmount').oninput = function(){
        var amt = parseFloat(this.value)||0;
        document.getElementById('buyReceive').textContent = (amt/buyPrice).toFixed(6) + ' ' + buySym;
      };
    }

    function closeModal(id){ document.getElementById(id).classList.remove('open'); }

    function confirmBuy() {
      var amt = document.getElementById('buyAmount').value;
      if(!amt||amt<=0){showToast('Enter a valid amount','⚠️');return;}
      closeModal('buyModal');
      showToast('Purchased $'+parseFloat(amt).toFixed(2)+' of '+buyName+'!','✅');
    }

    function earnStart(plan) {
      if(!currentUser){showToast('Please login to start earning','⚠️');navigate('login');return;}
      showToast('Enrolled in '+plan+'! Earnings start tomorrow.','💸');
    }

    function toggleFaq(el) { el.closest('.faq-item').classList.toggle('open'); }

    function submitSupport() {
      var name = document.getElementById('suppName').value.trim();
      var email = document.getElementById('suppEmail').value.trim();
      var msg = document.getElementById('suppMsg').value.trim();
      if(!name||!email||!msg){showToast('Please fill in all fields','⚠️');return;}
      showToast("Message sent! We'll reply within 2 hours.",'📬');
    }

    function renderDashChart() {
      var svg = document.getElementById('portfolioChart');
      var W=600, H=200, pad=30;
      var raw=[18000,19500,21000,20000,22500,24000,23000,25000,24500,26000];
      var max=Math.max.apply(null,raw), min=Math.min.apply(null,raw);
      var pts = raw.map(function(v,i){
        var x=pad+(i/(raw.length-1))*(W-pad*2);
        var y=pad+(1-(v-min)/(max-min))*(H-pad*2);
        return x+','+y;
      });
      var lineD = 'M'+pts.join('L');
      var areaD = lineD+'L'+(W-pad)+','+(H-pad)+'L'+pad+','+(H-pad)+'Z';
      var dots = raw.map(function(v,i){
        var x=pad+(i/(raw.length-1))*(W-pad*2);
        var y=pad+(1-(v-min)/(max-min))*(H-pad*2);
        return '<circle cx="'+x+'" cy="'+y+'" r="3.5" fill="#00e676" opacity="0.7"/>';
      }).join('');
      svg.innerHTML =
        '<defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#00e676" stop-opacity="0.25"/><stop offset="100%" stop-color="#00e676" stop-opacity="0"/></linearGradient></defs>' +
        '<path d="'+areaD+'" fill="url(#cg)"/>' +
        '<path d="'+lineD+'" fill="none" stroke="#00e676" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        dots +
        '<text x="'+pad+'" y="'+(H-8)+'" fill="#444" font-size="11">30d ago</text>' +
        '<text x="'+(W-pad)+'" y="'+(H-8)+'" fill="#444" font-size="11" text-anchor="end">Today</text>';
    }

    function setTab(btn, label) {
      document.querySelectorAll('.chart-tab').forEach(function(t){t.classList.remove('active')});
      btn.classList.add('active');
      renderDashChart();
      showToast('Viewing '+label+' performance','📊');
    }

    document.getElementById('buyModal').addEventListener('click', function(e){
      if(e.target===this) closeModal('buyModal');
    });

    navigate('home');
  