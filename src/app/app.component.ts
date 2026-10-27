import { Component, signal } from '@angular/core';
import { Tarefa } from './tarefa';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TODOapp';
  arrayDeTarefas = signal<Tarefa[]>([
    new Tarefa('Estudar Frameworks WEB', false),
    new Tarefa('Comer Pizza', false),
    new Tarefa('Ajudar meus pais', false)
  ]);
  apiURL: string;

  constructor(private http: HttpClient) {
    this.apiURL = 'https://sistema-integrado-a8s9.onrender.com';
    this.READ_tarefas();
  }

  CREATE_tarefa(descricaoNovaTarefa: string) {
    if (!descricaoNovaTarefa || !descricaoNovaTarefa.trim()) return;
    var novaTarefa = new Tarefa(descricaoNovaTarefa, false);
    this.http.post<Tarefa>(`${this.apiURL}/api/post`, novaTarefa).subscribe({
      next: (resultado) => {
        console.log(resultado);
        this.READ_tarefas();
      },
      error: (err) => {
        console.warn('Aviso backend:', err.message);
        novaTarefa._id = String(Date.now());
        this.arrayDeTarefas.update((tarefas) => [novaTarefa, ...tarefas]);
      }
    });
  }

  READ_tarefas() {
    this.http.get<Tarefa[]>(`${this.apiURL}/api/getAll`).subscribe({
      next: (resultado) => {
        if (resultado && resultado.length > 0) {
          this.arrayDeTarefas.set(resultado);
        }
      },
      error: (err) => {
        console.warn('Backend offline ou aguardando conexão:', err.message);
      }
    });
  }

  DELETE_tarefa(tarefaAserRemovida: Tarefa) {
    var indice = this.arrayDeTarefas().indexOf(tarefaAserRemovida);
    var id = this.arrayDeTarefas()[indice]?._id;
    if (id) {
      this.http.delete<Tarefa>(`${this.apiURL}/api/delete/${id}`).subscribe({
        next: (resultado) => {
          console.log(resultado);
          this.READ_tarefas();
        },
        error: (err) => {
          console.warn('Aviso backend delete:', err.message);
          this.arrayDeTarefas.update((tarefas) => tarefas.filter((t) => t !== tarefaAserRemovida));
        }
      });
    } else {
      this.arrayDeTarefas.update((tarefas) => tarefas.filter((t) => t !== tarefaAserRemovida));
    }
  }

  UPDATE_tarefa(tarefaAserModificada: Tarefa) {
    var indice = this.arrayDeTarefas().indexOf(tarefaAserModificada);
    var id = this.arrayDeTarefas()[indice]?._id;
    if (id) {
      this.http.patch<Tarefa>(`${this.apiURL}/api/update/${id}`, tarefaAserModificada).subscribe({
        next: (resultado) => {
          console.log(resultado);
          this.READ_tarefas();
        },
        error: (err) => {
          console.warn('Aviso backend update:', err.message);
        }
      });
    }
  }
}

export { AppComponent as App };
