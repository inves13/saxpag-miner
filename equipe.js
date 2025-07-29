// equipe.js

const auth = firebase.auth();
const db = firebase.database();

auth.onAuthStateChanged(user => {
  if (user) {
    const uid = user.uid;

    db.ref('usuarios/' + uid).once('value').then(snapshot => {
      const dados = snapshot.val();
      const codigoBruto = dados?.codigoConvite || uid;
      const meuCodigo = codigoBruto.substring(0, 8);

      document.getElementById('meuCodigo').innerText = meuCodigo;
      document.getElementById('meuLink').innerText = `https://inves13.github.io/saxpag-miner/#/reg?ref=${meuCodigo}`;

      contarEquipe(meuCodigo);
    });
  } else {
    window.location.href = 'index.html';
  }
});

function contarEquipe(codigo) {
  db.ref('usuarios').once('value').then(snapshot => {
    let lev1 = 0, lev2 = 0, lev3 = 0;
    let validos1 = 0, validos2 = 0, validos3 = 0;
    let recargaEquipe = 0;
    let retiradaEquipe = 0;

    const usuarios = snapshot.val() || {};
    const mapaIndicacao = {};
    const mapaDados = {};

    // Mapeia os dados dos usuários
    for (let uid in usuarios) {
      const user = usuarios[uid];
      mapaIndicacao[uid] = {
        indicacao: (user.indicacao || '').substring(0, 8),
        vip: user.vip || 0
      };
      mapaDados[uid] = user;
    }

    // Agora buscamos todos os usuários que se cadastraram com o código de indicação correto
    for (let uid1 in mapaIndicacao) {
      const indicacao1 = mapaIndicacao[uid1].indicacao;
      if (indicacao1 === codigo) { // Confirma que o código de convite do usuário corresponde ao seu
        lev1++;
        if (mapaIndicacao[uid1].vip >= 1) validos1++;

        const user1 = mapaDados[uid1];
        recargaEquipe += user1.recarga || 0;
        retiradaEquipe += user1.retirada || 0;

        // Busca os usuários de nível 2
        for (let uid2 in mapaIndicacao) {
          const indicacao2 = mapaIndicacao[uid2].indicacao;
          if (indicacao2 === uid1) {
            lev2++;
            if (mapaIndicacao[uid2].vip >= 1) validos2++;

            const user2 = mapaDados[uid2];
            recargaEquipe += user2.recarga || 0;
            retiradaEquipe += user2.retirada || 0;

            // Busca os usuários de nível 3
            for (let uid3 in mapaIndicacao) {
              const indicacao3 = mapaIndicacao[uid3].indicacao;
              if (indicacao3 === uid2) {
                lev3++;
                if (mapaIndicacao[uid3].vip >= 1) validos3++;

                const user3 = mapaDados[uid3];
                recargaEquipe += user3.recarga || 0;
                retiradaEquipe += user3.retirada || 0;
              }
            }
          }
        }
      }
    }

    const totalEquipe = lev1 + lev2 + lev3;
    const totalComissao = (validos1 * 0.5 + validos2 * 0.3 + validos3 * 0.2).toFixed(2);

    // Exibir na página
    document.getElementById('lev1Total').innerText = lev1;
    document.getElementById('lev1Validos').innerText = validos1;
    document.getElementById('lev2Total').innerText = lev2;
    document.getElementById('lev2Validos').innerText = validos2;
    document.getElementById('lev3Total').innerText = lev3;
    document.getElementById('lev3Validos').innerText = validos3;

    document.getElementById('totalEquipe').innerText = totalEquipe;
    document.getElementById('totalComissao').innerText = `$${totalComissao}`;
    document.getElementById('totalRecarga').innerText = `$${recargaEquipe.toFixed(2)}`;
    document.getElementById('totalRetirada').innerText = `$${retiradaEquipe.toFixed(2)}`;
  });
}

function copiarCodigo() {
  const texto = document.getElementById('meuCodigo').innerText;
  navigator.clipboard.writeText(texto).then(() => alert("Código copiado!"));
}
