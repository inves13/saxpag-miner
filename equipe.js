// equipe.js

const auth = firebase.auth();
const db = firebase.database();

auth.onAuthStateChanged(user => {
  if (user) {
    const uid = user.uid;

    db.ref('usuarios/' + uid).once('value').then(snapshot => {
      const dados = snapshot.val();
      const meuCodigo = dados.codigoConvite;
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

    const usuarios = snapshot.val();
    const mapaIndicacao = {};
    const mapaDados = {};

    for (let uid in usuarios) {
      const user = usuarios[uid];
      mapaIndicacao[uid] = {
        indicacao: user.indicacao,
        vip: user.vip || 0
      };
      mapaDados[uid] = user;
    }

    for (let uid in mapaIndicacao) {
      const nivel1 = mapaIndicacao[uid].indicacao;
      if (nivel1 === codigo) {
        lev1++;
        if (mapaIndicacao[uid].vip >= 1) validos1++;

        const user1 = mapaDados[uid];
        recargaEquipe += user1.recarga || 0;
        retiradaEquipe += user1.retirada || 0;

        const nivel2 = uid;
        for (let uid2 in mapaIndicacao) {
          if (mapaIndicacao[uid2].indicacao === nivel2) {
            lev2++;
            if (mapaIndicacao[uid2].vip >= 1) validos2++;

            const user2 = mapaDados[uid2];
            recargaEquipe += user2.recarga || 0;
            retiradaEquipe += user2.retirada || 0;

            const nivel3 = uid2;
            for (let uid3 in mapaIndicacao) {
              if (mapaIndicacao[uid3].indicacao === nivel3) {
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

    document.getElementById('lev1Total').innerText = lev1;
    document.getElementById('lev1Validos').innerText = validos1;
    document.getElementById('lev2Total').innerText = lev2;
    document.getElementById('lev2Validos').innerText = validos2;
    document.getElementById('lev3Total').innerText = lev3;
    document.getElementById('lev3Validos').innerText = validos3;

    const totalEquipe = lev1 + lev2 + lev3;
    const totalComissao = (validos1 * 0.5 + validos2 * 0.3 + validos3 * 0.2).toFixed(2);

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
