import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, deleteDoc, updateDoc, getDocs, Query } from '@angular/fire/firestore';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class FirestoreDataService {

  collectionName = '';

  constructor(public firestore: Firestore) { }

  getAll<type>(): Observable<type[]> {
    const collectionRef = collection(this.firestore, this.collectionName);
    return collectionData(collectionRef, { idField: 'id'}) as Observable<type[]>;
  }

  getById<type>(id: string): Observable<type> {
    const docRef = doc(this.firestore, this.collectionName +`/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<type>;
  }

  async getByQuery<type>(query: Query): Promise<type[]>{
    const result : type[] = [];
    const docs = await getDocs(query);

    docs.forEach(doc => {
      result.push(doc.data() as type)
    });

    return result;
  }

  add<type>(objectToAdd: any) {
    const collectionRef = collection(this.firestore, this.collectionName);
    return addDoc(collectionRef, objectToAdd);
  }

  //Not tested
  delete<type>(objectToDelete: type & {id?: string}) {
    const docRef = doc(this.firestore, this.collectionName +`/${objectToDelete.id}`);
    return deleteDoc(docRef);
  }

//Not tested
  update<type>(objectToUpdate: type & {id?: string}, fieldsToUpdate: any) {
    const docRef = doc(this.firestore, this.collectionName + `/${objectToUpdate.id}`);
    return updateDoc(docRef, fieldsToUpdate);
    //return updateDoc(docRef, { title: objectToUpdate.title, text: objectToUpdate.text });
  }
}
